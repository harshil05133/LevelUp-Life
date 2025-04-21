import React from 'react';

const StreakDisplay = ({ currentStreak }) => {
  const streak = currentStreak || 0;
  
  if (streak === 0) return null; // If streak is zero, gradient won't display

  return(
    // Streak display component
    <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-lg shadow-lg text-white mb-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-1">Current Streak</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{streak}</span>
            <span className="text-xl">{streak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
        <div className="text-4xl self-center">
          {/* Emojis for streaks */}
          {streak >= 3 ? '🔥' : '🕯️'}
        </div>
      </div>
      {streak >= 3 && (
        <div className="mt-2 text-sm bg-white/20 p-2 rounded text-center font-medium">
          20% XP Bonus Active!
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;
