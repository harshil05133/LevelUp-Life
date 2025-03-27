import axiosInstance from './axiosInstance'; // Import the axios instance for consistent configuration

const API_URL = '/tasks';

// const getAuthHeader = () => {
//   const token = localStorage.getItem('token');
//   console.log("Token in localStorage:", localStorage.getItem('token'));
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   };
  
// };

export const getTasks = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axiosInstance.post(API_URL, taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};
// This code provides functions to interact with the task API.
// It includes functions to get all tasks, create a new task, update an existing task, and delete a task.
// Each function makes an HTTP request to the backend API and returns the response data.
// The getAuthHeader function is used to include the authentication token in the request headers.
// This ensures that only authenticated users can access the task-related endpoints.
// The API_URL constant defines the base URL for the task-related API endpoints.
// The functions use axios to make HTTP requests, and the responses are returned as promises.
// This allows the frontend to easily interact with the backend API for task management.