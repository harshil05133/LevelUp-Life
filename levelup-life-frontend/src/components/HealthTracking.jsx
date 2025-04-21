// components/HealthTracking.jsx

import React, { useState, useEffect } from 'react';
import { createHealthLog, getHealthLogs } from '../api/health';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Main functional component
const HealthTracking = () => {
  // Form input states
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [sleepHours, setSleepHours] = useState('');
  const [calories, setCalories] = useState('');
  const [activityMinutes, setActivityMinutes] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [mood, setMood] = useState('');

  // State to store recent logs
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  // Fetch logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getHealthLogs();
  
        // ✅ Make sure it's an array before using
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.warn('Expected array but got:', data);
          setLogs([]); // fallback to empty array
        }
      } catch (err) {
        setError('Failed to load logs');
        console.error(err);
        setLogs([]); // avoid .map crash even on failure
      }
    };
  
    fetchLogs();
  }, []);
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!sleepHours && !calories && !activityMinutes && !waterIntake && !mood) {
      setError('Please enter at least one field');
      return;
    }

    try {
      const logData = {
        date,
        sleepHours: Number(sleepHours),
        calories: Number(calories),
        activityMinutes: Number(activityMinutes),
        waterIntake: Number(waterIntake),
        mood,
      };

      const newLog = await createHealthLog(logData);
      setLogs([newLog, ...logs]); // Add new log to top of list

      // Reset form
      setSleepHours('');
      setCalories('');
      setActivityMinutes('');
      setWaterIntake('');
      setMood('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit health data');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Health Tracking</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form for health data */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Sleep Hours</label>
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Activity (Minutes)</label>
            <input
              type="number"
              value={activityMinutes}
              onChange={(e) => setActivityMinutes(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Water Intake (oz)</label>
            <input
              type="number"
              value={waterIntake}
              onChange={(e) => setWaterIntake(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="Happy">😊 Happy</option>
              <option value="Tired">😴 Tired</option>
              <option value="Stressed">😣 Stressed</option>
              <option value="Motivated">💪 Motivated</option>
              <option value="Relaxed">😌 Relaxed</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors"
        >
          Log Health Data
        </button>
      </form>

      {/* Display recent logs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-600">No entries yet.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log._id}
                className="bg-white p-4 rounded-lg shadow-md text-sm"
              >
                <p><strong>Date:</strong> {dayjs.utc(log.date).format('MMMM D, YYYY')}</p>
                {log.sleepHours != null && <p><strong>Sleep:</strong> {log.sleepHours} hrs</p>}
                {log.calories != null && <p><strong>Calories:</strong> {log.calories} kcal</p>}
                {log.activityMinutes != null && <p><strong>Activity:</strong> {log.activityMinutes} mins</p>}
                {log.waterIntake != null && <p><strong>Water:</strong> {log.waterIntake} oz</p>}
                {log.mood && <p><strong>Mood:</strong> {log.mood}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HealthTracking;
