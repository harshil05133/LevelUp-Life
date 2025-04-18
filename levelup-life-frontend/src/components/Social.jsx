import React, { useState, useEffect } from 'react';
import { getUserStats, updateUserXP, getFriendsStats, addFriend, getLeaderboard } from '../api/user';

const Social = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [friendsStats, setFriendsStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [searchUsername, setSearchUsername] = useState(''); // State for search input

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  // Load leaderboard and user stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLeaderboard();

        // Fetch user stats
        const userStats = await getUserStats();
        setUserStats(userStats);

        // Fetch friends stats
        const friendStats = await getFriendsStats();
        setFriendsStats(friendStats);
      } catch (err) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // Function to add a friend by username
  const handleAddFriend = async () => {
    try {
      console.log('Adding friend with username:', searchUsername); // Debugging log
      await addFriend(searchUsername); // Pass the username directly
      setError('Friend added successfully!');
      setSearchUsername(''); // Clear the search bar

      // Refresh leaderboard after adding a friend
      await fetchLeaderboard();
    } catch (err) {
      setError('Failed to add friend');
    }
  };

  if (loading) return <div className="text-center p-8">Loading leaderboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search bar */}
      <div className="flex justify-end p-4">
        <input
          type="text"
          placeholder="Enter username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button
          onClick={handleAddFriend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Friend
        </button>
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={fetchLeaderboard}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          Refresh Leaderboard
        </button>
        <ul className="w-1/2 bg-white shadow-md rounded p-4">
          {leaderboard?.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-gray-200 py-2"
            >
              <span>
                <strong>{index + 1}.</strong> {entry.username}
              </span>
              <span>{entry.totalXP} XP (Level {entry.level})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Social;