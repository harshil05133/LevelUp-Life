import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
// This component checks if the user is authenticated before rendering the protected route.
// If the user is not authenticated, it redirects them to the login page.
// If the authentication status is still loading, it shows a loading message.
// This is useful for protecting routes that require user authentication, ensuring that only logged-in users can access certain parts of the application.