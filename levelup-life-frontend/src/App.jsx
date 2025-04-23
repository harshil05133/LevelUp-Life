// src/App.jsx
// Main application file: sets up routing, authentication context, and the responsive navbar layout.

import React, { useContext, useState } from 'react';
import { Routes, Route, Outlet, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Hamburger & close icons

// Import all page components
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Social from './components/Social';
import HealthTracking from './components/HealthTracking';
import TaskManagement from './components/TaskManagement';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute'; // Wraps routes that require auth

// Authentication context provider and hook
import { AuthContext, AuthProvider } from './context/AuthContext';
import './App.css'; // Global styles (e.g. tailwind imports)

// Logo SVG import from assets
import LevelUpLogo from './assets/levelup-life logo.svg';

// Layout component defines the navbar and renders nested routes via <Outlet>
function Layout() {
  // Grab auth status and user info from context
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  // Local state for mobile menu open/closed
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  // Define nav links in one array to DRY up code
  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/social', label: 'Social' },
    { to: '/health-tracking', label: 'Health Tracking' },
    { to: '/task-management', label: 'Task Management' },
  ];

  return (
    // Full-screen gray background
    <div className="min-h-screen bg-gray-100">
      {/* Navbar with 45° gradient background */}
      <nav className="w-full bg-gradient-to-br from-blue-400 via-green-400 to-green-400">
        <div className="relative max-w-screen-xl mx-auto flex items-center justify-between py-2 px-4">

          {/* Logo on the left: clickable to home if desired */}
          <div className="flex-shrink-0">
            <img
              src={LevelUpLogo}
              alt="Level Up Your Life"
              className="h-8 md:h-10"
            />
          </div>

          {/* Desktop nav links: hidden on small screens, flex centered on md+ */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-8">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-white font-bold'
                        : 'text-white hover:text-gray-200'
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop auth/user controls: hidden on small, shown on md+ */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              // If logged in, show avatar, username initial, and logout button
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-500 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-400 text-white px-4 py-1 rounded hover:bg-red-300 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              // If not logged in, show register/login links
              <div className="space-x-4">
                <NavLink to="/register" className="text-white hover:text-gray-200">
                  Register
                </NavLink>
                <NavLink to="/login" className="text-white hover:text-gray-200">
                  Login
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile hamburger/X: absolute top-right, shown only on small screens */}
          <button
            className="md:hidden absolute right-4 top-2 text-white text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile dropdown: shown when menuOpen is true */}
        {menuOpen && (
          <div className="md:hidden bg-gradient-to-br from-blue-400 via-green-400 to-green-400 px-4 pb-4">
            {/* Mobile nav links in column */}
            <ul className="space-y-2 text-center mt-2">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="block text-white hover:text-gray-200"
                    onClick={() => setMenuOpen(false)} // Close menu on click
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile auth/user row under links */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-500 font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white">{user.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="bg-red-400 text-white px-4 py-1 rounded hover:bg-red-300 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Mobile register/login below nav links
                <>
                  <NavLink
                    to="/register"
                    className="text-white hover:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-white hover:text-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Nested routes render here */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

// Main App component: wraps routes in AuthProvider
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
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
}

export default App;
