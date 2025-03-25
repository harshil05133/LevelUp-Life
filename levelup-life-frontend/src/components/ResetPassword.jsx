import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token is valid
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-reset-token/${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Invalid or expired token');
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch (err) {
        setError('Server error. Please try again later.');
        setIsValid(false);
      }
    };
    
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Password reset successful');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {isValid ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md text-white font-medium bg-gradient-to-r from-green-400 
            to-green-600 hover:from-green-500 hover:to-green-700 transition duration-200 focus:outline-none focus:ring-2 
            focus:ring-green-500 focus:ring-opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p>Please request a new password reset link.</p>
          <Link to="/forgot-password" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Forgot Password
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
// This component handles the password reset functionality.
// It verifies the token, allows the user to enter a new password, and submits the reset request.
// It also provides feedback on success or failure of the operation.
// This component allows users to reset their password using a token sent to their email.