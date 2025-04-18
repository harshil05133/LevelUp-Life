// api/user.js
import axiosInstance from './axiosInstance';

// Fetch user stats
export const getUserStats = async () => {
  const response = await axiosInstance.get('/user/stats');
  return response.data;
};

// Update user XP
export const updateUserXP = async (xpData) => {
  const response = await axiosInstance.post('/user/xp', xpData);
  return response.data;
};

// Fetch friends' stats
export const getFriendsStats = async () => {
  const response = await axiosInstance.get('/user/friends');
  return response.data;
};

// Add a new friend
export const addFriend = async (username) => {
  const response = await axiosInstance.post('/user/friends', { username }); // Send username in the request body
  return response.data;
};

// Fetch leaderboard
export const getLeaderboard = async () => {
  const response = await axiosInstance.get('/user/leaderboard');
  return response.data;
};

