import React, { useState, useEffect } from 'react';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  const [completedCount, setCompletedCount] = useState(0);

  // Load tasks and completed count from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompletedCount = localStorage.getItem('completedCount');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCompletedCount) setCompletedCount(parseInt(savedCompletedCount));
  }, []);

  // Save tasks and completed count to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedCount', completedCount.toString());
  }, [tasks, completedCount]);

  const addTask = () => {
    if (!taskName.trim()) return;
    
    setTasks([...tasks, { 
      name: taskName, 
      dueDate, 
      completed: false,
      id: Date.now() // unique ID for each task
    }]);
    setTaskName('');
    setDueDate('');
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (taskName.trim()) {
      addTask();
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        // If task is being marked as completed (and wasn't before), increment counter
        if (!task.completed) {
          setCompletedCount(prev => prev + 1);
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const resetCompletedCount = () => {
    setCompletedCount(0);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>
      
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
        {/* Your inputs here */}
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
              key={task.id} 
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
                  onClick={() => toggleComplete(task.id)}
                  className={`px-3 py-1 rounded text-white ${
                    task.completed 
                      ? 'bg-gray-400 hover:bg-gray-500' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  } transition-colors duration-200`}
                >
                  {task.completed ? 'Undo' : 'Completed'}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
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
