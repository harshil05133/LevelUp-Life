import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';

//functional component TaskManagement
const TaskManagement = () => {
  const [tasks, setTasks] = useState([]); //initally empty array for lists of tasks
  const [taskName, setTaskName] = useState(''); //state for current task name input
  const [dueDate, setDueDate] = useState(() => { //state for due date input, initialied with todays date
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD *changed later*
  });
  const [completedCount, setCompletedCount] = useState(0); //state for task counter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Add this manual request to verify token
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
  
        // Your existing axios request
        const data = await getTasks();
        setTasks(data);
        setCompletedCount(data.filter(task => task.completed).length);
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
    
    try {
      const newTask = await createTask({
        name: taskName,
        dueDate
      });
      
      setTasks([...tasks, newTask]);
      setTaskName('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const updatedTask = await updateTask(id, { 
        completed: !task.completed 
      });
      
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      
      // Update completed count
      if (!task.completed) {
        setCompletedCount(prev => prev + 1);
      } else {
        setCompletedCount(prev => prev - 1);
      }
    } catch (err) {
      setError('Failed to update task');
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
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white shadow rounded-lg p-3">
          <span className="font-bold text-lg">Completed Tasks: </span>
          <span className="text-green-600 font-bold text-lg">{completedCount}</span>
        </div>
        <button 
          onClick={resetCompletedCount}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
        >
          Reset Counter
        </button>
      </div>
      
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
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleComplete(task._id)}
                  className={`px-3 py-1 rounded text-white ${
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