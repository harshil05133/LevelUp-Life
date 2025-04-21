import axiosInstance from './axiosInstance'; 



//Create a new health log
export const createHealthLog = async (logData) => {
  const response = await axiosInstance.post('/health', logData);
  return response.data;
};


//Get all health logs for the user
export const getHealthLogs = async () => {
  const response = await axiosInstance.get('/health');
  return response.data;
};
