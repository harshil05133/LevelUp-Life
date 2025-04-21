const HealthLog = require('../models/healthModel');
const User = require('../models/userModel');

//Create a new health log entry
exports.createHealthLog = async (req, res) => {
  try {
    const { date, sleepHours, calories, activityMinutes, waterIntake, mood } = req.body;

    // Validate required fields
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Create a new health log
    const healthLog = new HealthLog({
      user: req.user, // Attach the user ID from authMiddleware
      date,
      sleepHours,
      calories,
      activityMinutes,
      waterIntake,
      mood,
    });

    const savedLog = await healthLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error creating health log:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all health logs for the logged-in user
exports.getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching health logs:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};