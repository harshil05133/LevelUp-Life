// src/components/Home.jsx
// This component renders the Home page with a hero section and feature cards.
// It uses React Router's Link for navigation and Tailwind CSS for styling.

import React from 'react';
import { Link } from 'react-router-dom';
// Import SVG icons from the assets folder
import dashboardSvg from '../assets/dashboard.svg';
import healthSvg    from '../assets/health.svg';
import taskSvg      from '../assets/task.svg';

// Main Home component
function Home() {
  return (
    // Outer container: full-screen height, dark background, centered content
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center pt-32 px-6">
      {/* Hero section: headline, subtext, and login button */}
      <header className="text-center">
        {/* Main title: adjusted font size and weight with Tailwind's !important utility */}
        <h1 className="!text-[64px] !font-bold">Level Up your Life</h1>

        {/* Subtitle: spaced below the title, constrained width for readability */}
        <p className="mt-5 text-xl text-gray-300 max-w-2xl mx-auto">
          Achieve your goals through{' '}
          {/* Highlight word in green */}
          <span className="text-green-400">gamified</span> productivity. 🚀
        </p>

        {/* Login button: navigates to /login, gradient background, hover color transition */}
        <Link
          to="/login"
          className="
            mt-7 inline-block
            px-8 py-3
            bg-gradient-to-r from-blue-400 to-green-400
            rounded-full font-medium text-xl
            transition-colors duration-200 ease-out
            hover:from-blue-500 hover:to-green-500
          "
        >
          Login
        </Link>
      </header>

      {/* Feature cards container: spaced below hero, responsive grid layout */}
      <main className="mt-28 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Dashboard feature card */}
        <FeatureCard
          to="/dashboard"
          imgSrc={dashboardSvg}
          alt="Dashboard"
          title="Dashboard"
          description="Get an overview of your progress, achievements, and stats. 🔥"
        />

        {/* Health Tracking feature card */}
        <FeatureCard
          to="/health-tracking"
          imgSrc={healthSvg}
          alt="Health Tracking"
          title="Health Tracking"
          description="Track your fitness, sleep, and wellness habits. 💪"
        />

        {/* Task Management feature card */}
        <FeatureCard
          to="/task-management"
          imgSrc={taskSvg}
          alt="Task Management"
          title="Task Management"
          description="Keep yourself accountable and organize your daily tasks. 📝"
        />
      </main>
    </div>
  );
}

// Reusable FeatureCard component for each feature box
function FeatureCard({ to, imgSrc, alt, title, description }) {
  return (
    // Each card is a link to its respective route
    <Link
      to={to}
      className="block bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-colors duration-200"
    >
      {/* Icon image centered at top of card */}
      <img src={imgSrc} alt={alt} className="mx-auto mb-4 h-12 w-12" />

      {/* Feature title */}
      <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>

      {/* Feature description */}
      <p className="text-gray-400 text-center">{description}</p>
    </Link>
  );
}

// Export Home component as default export
export default Home;
