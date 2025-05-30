import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { getUserStats, updateUserXP } from '../api/user';
import StreakDisplay from './StreakDisplay';

//functional component TaskManagement
const TaskManagement = () => {
  const [tasks, setTasks] = useState([]); //initally empty array for lists of tasks
  const [taskName, setTaskName] = useState(''); //state for current task name input
  const [points, setPoints] = useState(0); //state for points input
  const [taskType, setTaskType] = useState(''); //state for task type input
  const [dueDate, setDueDate] = useState(() => { //state for due date input, initialied with todays date
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD *changed later*
  });
  const [completedCount, setCompletedCount] = useState(0); //state for task counter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTasks, setUpdatingTasks] = useState({}); // Track tasks being updated

  //some states for the xp and level up system
  const [totalXP, setTotalXP] = useState(0); //state for total xp
  const [level, setLevel] = useState(1); //state for current level
  const [xpToNextLevel, setXpToNextLevel] = useState(500); //state for xp needed to level up
  const [streak, setStreak] = useState({ count: 0, tasksCompletedToday: 0 }); // state for streak tracking

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Added this manual request to verify token
        console.log('Token for manual request:', localStorage.getItem('token'));
        const manualResponse = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Manual request status:', manualResponse.status);
        if (manualResponse.ok) {
          const manualData = await manualResponse.json();
          console.log('Manual request data:', manualData);
        }

        const response = await getTasks();
        
        // Fetch user stats
        const stats = await getUserStats();
        setTotalXP(stats.totalXP);
        setLevel(stats.level);
        setXpToNextLevel(stats.xpToNextLevel);
        setTasks(response.tasks);
        setStreak(response.streak);
        setCompletedCount(response.tasks.filter(task => task.completed).length);
        setLoading(false);

      } catch (err) {
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    if (!points) return;
    if (!taskType) return;
    
    try {
      const newTask = await createTask({
        name: taskName,
        dueDate,
        points,
        type: taskType
      });
      
      setTasks([...tasks, newTask]);
      setTaskName('');
      setPoints(0);
      setTaskType('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const toggleComplete = async (id) => {
    // Prevent multiple clicks while processing
    if (updatingTasks[id]) return;

    try {
      setUpdatingTasks(prev => ({ ...prev, [id]: true }));
      const task = tasks.find(t => t._id === id);
      
      // Optimistically update UI
      const updatedTask = { ...task, completed: !task.completed };
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      setCompletedCount(prev => task.completed ? prev - 1 : prev + 1);

      // Make API call
      const response = await updateTask(id, { completed: !task.completed });
      
      setTasks(tasks.map(t => t._id === id ? response.task : t));
      setStreak(response.streak);
      
      // Update XP based on the task's previous completion status
      // If task was completed (now being undone), remove points
      // If task was not completed (now being completed), add points
      const xpAmount = !task.completed ? task.points : -task.points;
      const xpResponse = await updateUserXP({ xpAmount });
      setTotalXP(xpResponse.totalXP);
      setLevel(xpResponse.level);
      setXpToNextLevel(xpResponse.xpToNextLevel);
    } catch (err) {
      const task = tasks.find(t => t._id === id);
      setTasks(tasks.map(t => t._id === id ? task : t));
      setCompletedCount(prev => task.completed ? prev + 1 : prev - 1);
      setError('Failed to update task');
    } finally {
      setUpdatingTasks(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      const task = tasks.find(t => t._id === id);
      setTasks(tasks.filter(t => t._id !== id));
      if (task.completed) {
        setCompletedCount(prev => prev - 1);
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const resetCompletedCount = async () => {
    try {
      // Get all completed tasks
      const completedTasks = tasks.filter(task => task.completed);
      
      // Update each completed task to be not completed
      const updatePromises = completedTasks.map(task => 
        updateTask(task._id, { completed: false })
      );
      
      // Wait for all updates to complete
      const updatedTasks = await Promise.all(updatePromises);
      
      // Update the tasks state
      setTasks(tasks.map(task => {
        if (task.completed) {
          // Find the updated version of this task
          const updated = updatedTasks.find(t => t._id === task._id);
          return updated || {...task, completed: false};
        }
        return task;
      }));
      
      // Reset the completed count
      setCompletedCount(0);

      // Reset XP and level in the database
      const response = await updateUserXP({ xpAmount: -totalXP, resetStreak: true }); // Subtract all XP and reset streak
      
      // Update local state with response from server
      setTotalXP(response.totalXP);
      setLevel(response.level);
      setXpToNextLevel(response.xpToNextLevel);
      setStreak({ count: 0, tasksCompletedToday: 0 });
      
      alert('Progress and streak have been reset.'); // Updated message


    } catch (err) {
      setError('Failed to reset completed tasks');
    }
  };

  if (loading) return <div className="text-center p-8">Loading tasks...</div>;

  //returns the page for the user to interact with
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Completed counter and reset button */}
      {/* XP and Level display */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white shadow rounded-lg p-3 flex space-x-4">
          <div>
            <span className="font-bold text-lg">Completed Tasks: </span>
            <span className="text-green-600 font-bold text-lg">{completedCount}</span>
          </div>
          <div>
            <span className="font-bold text-lg">Level: </span>
            <span className="text-purple-600 font-bold text-lg">{level}</span>
          </div>
          <div>
            <span className="font-bold text-lg">XP: </span>
            <span className="text-blue-600 font-bold text-lg">{totalXP%500}/{500}</span>
          </div>
        </div>
        <button 
          onClick={resetCompletedCount}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
        >
          Reset Progress
        </button>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, ((totalXP % 500) / 500) * 100)}%` }}
        ></div>
      </div>
      
      {/* Streak Display */}
      <StreakDisplay currentStreak={streak.count} />

      {/* Task input form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="p-3 border border-gray-300 rounded flex-grow"
          />
          <input
            placeholder="Points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full md:w-auto"
          />
          <input
            placeholder="Task type"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full md:w-auto"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full md:w-auto"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded transition-colors duration-200 font-medium"
          >
            Add Task
          </button>
        </div>
      </form>
      
      {/* Task list */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No tasks yet. Add some tasks to get started!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div 
              key={task._id} 
              className={`p-4 bg-white shadow-md rounded-lg flex items-center justify-between transition-all duration-200 ${
                task.completed ? 'border-l-4 border-green-500 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="bg-gray-200 text-gray-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <div>
                  <span className={`block text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.name}
                  </span>
                  <span className="block text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US') : 'No due date'}
                  </span>
                </div>
              </div>
              <div className="block text-lg font-semibold">
                {task.points} points
              </div>
              <div className="block text-lg font-semibold">
                {task.type}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleComplete(task._id)}
                  disabled={updatingTasks[task._id]}
                  className={`px-3 py-1 rounded text-white ${updatingTasks[task._id] ? 'opacity-50 cursor-not-allowed ' : ''} ${
                    task.completed 
                      ? 'bg-gray-400 hover:bg-gray-500' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  } transition-colors duration-200`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManagement;