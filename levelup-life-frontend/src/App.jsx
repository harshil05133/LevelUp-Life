
import React, { useContext } from 'react';
import { Routes, Route, Outlet, NavLink, useNavigate } from 'react-router-dom'; //needed for routing stuff


//all our headers being imported
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import HealthTracking from './components/HealthTracking';
import TaskManagement from './components/TaskManagement';
import Register from './components/Register';
import Login from './components/Login';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

// Layout component with navigation that will wrap all the pages together
const Layout = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="w-full bg-green-500 p-4">
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-8">
            <li><NavLink to="/" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Home</NavLink></li>
            <li><NavLink to="/dashboard" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Dashboard</NavLink></li>
            <li><NavLink to="/health-tracking" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Health Tracking</NavLink></li>
            <li><NavLink to="/task-management" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Task Management</NavLink></li>
          </ul>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-500 font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-white">{user.username}</span>
              </div>
              <button 
                onClick={logout}
                className="bg-white text-green-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <NavLink to="/register" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Register</NavLink>
              <NavLink to="/login" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Login</NavLink>
            </div>
          )}

        </div>
      </nav>
      {/* Outlet is where child routes will be rendered */}
        {/* This is a key part of nested routing in React Router */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};


// Create router with data-router pattern and route configuration
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="health-tracking" element={<ProtectedRoute><HealthTracking /></ProtectedRoute>} />
          <Route path="task-management" element={<ProtectedRoute><TaskManagement /></ProtectedRoute>} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;

