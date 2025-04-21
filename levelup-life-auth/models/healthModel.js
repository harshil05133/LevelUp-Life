const mongoose = require('mongoose');

// Define the schema for a health log entry
const healthSchema = new mongoose.Schema({
  // Reference to the user who created the entry
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Date of the log entry (default = today)
  date: {
    type: Date,
    default: Date.now
  },
  // Number of hours the user slept
  sleepHours: {
    type: Number,
    default: null,
  },
  calories: {
    type: Number,
    default: null,
  },
  activityMinutes: {
    type: Number,
    default: null,
  },
  waterIntake: {
    type: Number,
    default: null,
  },
  mood: {
    type: String,
    default: null,
  },
});

// Export the model as 'HealthLog'
module.exports = mongoose.model('HealthLog', healthSchema);