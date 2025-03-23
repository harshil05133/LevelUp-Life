import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import HealthTracking from './components/HealthTracking';
import TaskManagement from './components/TaskManagement';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

// Layout component with navigation
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="w-full bg-green-500 p-4">
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-8">
            <li><NavLink to="/" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Home</NavLink></li>
            <li><NavLink to="/dashboard" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Dashboard</NavLink></li>
            <li><NavLink to="/health-tracking" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Health Tracking</NavLink></li>
            <li><NavLink to="/task-management" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Task Management</NavLink></li>
            <li><NavLink to="/register" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Register</NavLink></li>
            <li><NavLink to="/login" className={({isActive}) => isActive ? "text-white font-bold" : "text-white hover:text-gray-200"}>Login</NavLink></li>
          </ul>
        </div>
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};


// Create router with data-router pattern
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "health-tracking", element: <HealthTracking /> },
      { path: "task-management", element: <TaskManagement /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
