import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getTasks = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, getAuthHeader());
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, getAuthHeader());
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
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