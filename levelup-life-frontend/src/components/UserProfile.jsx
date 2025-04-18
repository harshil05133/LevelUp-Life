import React, {useEffect, useState} from 'react';
import {getUserStats} from '../api/user'; // Adjust the import based on your file structure


const UserProfile = () => {
  const [userStats, setUserStats] = useState({ totalXP: 0, level: 1, xpToNextLevel: 500});
  const [user, setUser] = useState({ username: ''});

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData){
      setUser(JSON.parse(userData));
    }

    //Fetch xp/level stats from backend
    const fetchStats = async () => {
      try{
        const stats = await getUserStats();
        setUserStats(stats);
      }
      catch (err){
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-6 mb-8">
      {/* Avatar (placeholder) */}
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
        {user.username ? user.username[0].toUpperCase() : '?'}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-5">Welcome back, {user.username || 'User'}!</h2>
        <div className="flex space-x-4">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
            Level {userStats.level}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
            {userStats.totalXP} XP
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            {userStats.xpToNextLevel - userStats.totalXP} XP to next level
          </span>
        </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (userStats.totalXP % 500) / 500 * 100)}%` }}
          ></div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UserProfile;