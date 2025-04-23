import React, { useEffect, useState } from 'react';
import { getTasks } from '../api/tasks';

const TaskSummary = () => {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTotal(data.tasks.length);
        setCompleted(data.tasks.filter(t => t.completed).length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold mb-2">Task Summary</h3>
      <div className="flex justify-center items-center space-x-6">
        <div className="text-green-600 font-bold">✅ Completed: {completed}</div>
        <div className="text-yellow-600 font-bold">🕒 Pending: {total - completed}</div>
        <div className="text-blue-600 font-bold">📋 Total: {total}</div>
      </div>
    </div>
  );
};

export default TaskSummary;