//importing axios for http requests
import axios from 'axios';

//base URL for the backend server
const API_URL = 'http://localhost:5000/api/auth';

//async function for user registration
//makes a POST request to the /register endpoint on the backend
//userdata is the object containing the user's registration details
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

//same thing but for login
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};