import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

//kinda same vibe as the login component
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Destructure form field values from formData for easier access
  const { username, email, password, confirmPassword } = formData;

  //same as login
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //same as login
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    
    // Validate passwords match before submitting
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    //set loading state to true to show loading indicator
    setIsLoading(true);
    
    //try to register the user using the register function from the auth API
    //if successful, show a success message and redirect to the login page
    try {
      const response = await register({
        username,
        email,
        password
      });
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect to the login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000); //2 second delay to give user time to see the success message
      
    } catch (error) {
      console.log('Registration error:', error);
      console.log('Response data:', error.response?.data);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  //return the registration form for the user
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      
      {/* Page title */}
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
      
      {/* Conditional rendering of error message if there is an error*/}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
       {/* Conditional rendering of success message if registration was successful */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
       {/* Registration form with onSubmit handler */}
      <form onSubmit={onSubmit} className="space-y-4">
         {/* Username input field */}
        <div>
          <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
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
        
         {/* Password input field with minimum length requirement */}
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {/* Password requirement hint */}
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>
        
         {/* Password confirmation field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
          {/* Register button with loading state */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-md text-white font-medium bg-gradient-to-r from-green-400 
          to-green-600 hover:from-green-500 hover:to-green-700 transition duration-200 focus:outline-none focus:ring-2 
          focus:ring-green-500 focus:ring-opacity-50"
        >
          {/* Button text changes based on loading state */}
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        
        {/* Login link for existing users */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
