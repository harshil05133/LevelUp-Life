import React, { useState, useEffect } from 'react';

//functional component TaskManagement
const TaskManagement = () => {
  const [tasks, setTasks] = useState([]); //initally empty array for lists of tasks
  const [taskName, setTaskName] = useState(''); //state for current task name input
  const [dueDate, setDueDate] = useState(() => { //state for due date input, initialied with todays date
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD *changed later*
  });
  const [completedCount, setCompletedCount] = useState(0); //state for task counter

  // Load tasks and completed count from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks'); //get tasks from local storage
    const savedCompletedCount = localStorage.getItem('completedCount'); //get completed count from local storage
    
    //if tasks and completed count exist in local storage, parse JSON and set them as the initial state
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCompletedCount) setCompletedCount(parseInt(savedCompletedCount));
  }, []);

  // Save tasks and completed count to localStorage whenever they change as JSON string
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedCount', completedCount.toString());
  }, [tasks, completedCount]);

  //function to add a new task to the list
  const addTask = () => {
    if (!taskName.trim()) return;
    
    //update the tasks state by creating a new array with all existing tasks
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
    if (taskName.trim()) { // Only add task if task name is not empty
      addTask();
    }
  };

  //function to delete a task from the list by task ID
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  //function to toggle a tasks completion status
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        // If task is being marked as completed (and wasn't before), increment counter
        if (!task.completed) {
          setCompletedCount(prev => prev + 1);
        }
        //return a new task object with the complete status toggled
        return { ...task, completed: !task.completed };
      }
      //for all other tasks, return them unchanged
      return task;
    }));
  };

  //function to reset the completed task counter to 0
  const resetCompletedCount = () => {
    setCompletedCount(0);
  };

  //returns the page for the user to interact with
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>
      
      {/* Completed counter and reset button */}
      <div className="flex justify-between items-center mb-6">
        
         {/* Counter display */}
        <div className="bg-white shadow rounded-lg p-3">
          <span className="font-bold text-lg">Completed Tasks: </span>
          <span className="text-green-600 font-bold text-lg">{completedCount}</span>
        </div>

        {/* Reset button */}
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
        
        {/* Task name input */}
        <input
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="p-3 border border-gray-300 rounded flex-grow"
        />
        {/* Due date input */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 border border-gray-300 rounded w-full md:w-auto"
        />
        {/* Add task button */}
        <button 
          type="submit"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded transition-colors duration-200 font-medium"
        >
            Add Task
          </button>
        </div>
      </form>
      
      {/* Task list section*/}
      <div className="space-y-3">

         {/* Conditional rendering based on whether tasks exist */}
        {tasks.length === 0 ? (
          // Empty state message when no tasks exist
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No tasks yet. Add some tasks to get started!</p>
          </div>
        ) : (
          // Map through tasks array to render each task
          tasks.map((task, index) => (
            // Task item container with conditional styling for completed tasks
            <div 
              key={task.id} 
              className={`p-4 bg-white shadow-md rounded-lg flex items-center justify-between transition-all duration-200 ${
                task.completed ? 'border-l-4 border-green-500 bg-green-50' : ''
              }`}
            >
              {/* Left side with task number and details */}
              <div className="flex items-center">
                {/* Circular task number indicator */}
                <span className="bg-gray-200 text-gray-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  {index + 1}
                </span>

                 {/* Task name and due date */}
                <div>
                   {/* Task name with conditional styling for completed tasks */}
                  <span className={`block text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.name}
                  </span>

                   {/* Due date formatted as MM/DD/YYYY */}
                  <span className="block text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US') : 'No due date'}
                  </span>
                </div>
              </div>

                {/* Right side with action buttons */}
              <div className="flex space-x-2">
                {/* Complete/Undo button with conditional styling */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`px-3 py-1 rounded text-white ${
                    task.completed 
                      ? 'bg-gray-400 hover:bg-gray-500' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  } transition-colors duration-200`}
                >
                  {/* Button text changes based on task completion status */}
                  {task.completed ? 'Undo' : 'Completed'}
                </button>
                 {/* Delete button */}
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
