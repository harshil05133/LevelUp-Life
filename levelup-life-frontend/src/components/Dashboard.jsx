import React from 'react';
import UserProfile from './UserProfile';
import TaskSummary from './TaskSummary';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <UserProfile />
        <TaskSummary />
        {/*other dashboard widgets go here*/}
      </div>
    </div>
  );
};

export default Dashboard;