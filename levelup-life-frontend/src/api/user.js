// api/user.js
import axiosInstance from './axiosInstance';

export const getUserStats = async () => {
  const response = await axiosInstance.get('/user/stats');
  return response.data;
};

export const updateUserXP = async (xpData) => {
  const response = await axiosInstance.post('/user/xp', xpData);
  return response.data;
};
