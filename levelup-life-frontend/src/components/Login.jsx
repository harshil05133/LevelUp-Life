import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


//useState is a hook that allows you to have state variables in functional components
//useNavigate is a hook that allows you to navigate to different pages in your application


const Login = () => {
  const navigate = useNavigate(); //initialize the navigate function from the useNavigate hook
  
  //use state returns array with the current state value, and a function to update the state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  //states for error messages, tracking loading status during form submission, and state forthe remember me checkbox
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  //destructure the email and password from the formData object
  const { email, password } = formData;

  //function to update the form data when the user types in the input fields
  //e.target.name is the name attribute of the input field, e.target.value is the value entered by the user
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); //prevent a page reload
    setError(''); //reset the previous error messages
    setIsLoading(true); //set loading to true while the form is being submitted
    
    //try to log in the user using the login function from the auth API
    try {
      const response = await login(formData);
      
      // Store token in localStorage or sessionStorage based on remember me
      //local storage stays even after the browser is closed, session storage is cleared when the browser is closed
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', response.token); //store the jwt token in the selected storage
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  //return the login form for the user
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Login form with onSubmit handler */}
      <form onSubmit={onSubmit} className="space-y-4">
        
         {/* Email input field */}
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Password input field */}
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Remember me checkbox and forgot password link */}
        <div className="flex items-center justify-between">
          
          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          {/* Forgot password link */}
          <div className="text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>
        
        {/* Login button with loading state */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-md text-white font-medium bg-gradient-to-r from-green-400 
          to-green-600 hover:from-green-500 hover:to-green-700 transition duration-200 focus:outline-none focus:ring-2 
          focus:ring-green-500 focus:ring-opacity-50"
        >
          {/* Button text changes based on loading state */}
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        {/* Sign up link */}
        {/* Redirect to the register page if the user doesn't have an account */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
