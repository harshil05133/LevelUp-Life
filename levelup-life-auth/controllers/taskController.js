const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Constants for streak management
const streakTimeout = 10; // 10 seconds for testing (should be 24 hours / 86400 seconds)
const streakWindow = 20; // 20 seconds for testing (should be 48 hours / 172800 seconds)

const isWithinStreakWindow = (lastTaskDate) => {
  if (!lastTaskDate) return false;
  const now = new Date();
  const timeSinceLastTask = (now - new Date(lastTaskDate)) / 1000;
  return timeSinceLastTask <= streakWindow;
};

const isNewStreakPeriod = (lastTaskDate) => {
  if (!lastTaskDate) return true;
  const now = new Date();
  const timeSinceLastTask = (now - new Date(lastTaskDate)) / 1000;
  // A new streak period starts when we're past the timeout but still within the window
  return timeSinceLastTask > streakTimeout;
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user });
    const user = await User.findById(req.user);
    
    // Check if streak should be reset due to inactivity
    if (user.streak.lastTaskDate && !isWithinStreakWindow(user.streak.lastTaskDate)) {
      user.streak.count = 0;
      user.streak.tasksCompletedToday = 0;
      user.streak.lastTaskDate = null;
      await user.save();
    }
    
    res.json({ 
      tasks,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { name, points, dueDate, type } = req.body;
    const updatedDueDate = new Date(dueDate);
    updatedDueDate.setHours(updatedDueDate.getHours() + 4); // for some reason the date only displays correctly if it is 4 hours ahead
    const task = new Task({
      name,
      dueDate: updatedDueDate,
      userId: req.user,
      points,
      type
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.body.completed) {
      const user = await User.findById(req.user);
      const now = new Date();

      // First ever task completion
      if (!user.streak.lastTaskDate) {
        user.streak.tasksCompletedToday = 1;
        user.streak.count = 1;
        user.streak.lastTaskDate = now;
      }
      // Check if we're in a new streak period (past timeout)
      else if (isNewStreakPeriod(user.streak.lastTaskDate)) {
        // If still within streak window, increment streak
        if (isWithinStreakWindow(user.streak.lastTaskDate)) {
          user.streak.tasksCompletedToday = 1;
          user.streak.count += 1;
        } 
        // Outside streak window - start new streak
        else {
          user.streak.tasksCompletedToday = 1;
          user.streak.count = 1;
        }
        user.streak.lastTaskDate = now;
      }
      // Within the same streak period (before timeout)
      else {
        user.streak.tasksCompletedToday += 1;
      }

      user.streak.lastTaskDate = now;
      await user.save();

      if (user.streak.count >= 3) {
        task.points = Math.floor(task.points * 1.2); // 20% XP bonus
      }
    } else if (!req.body.completed) {
      const user = await User.findById(req.user);
      
      // Only modify streak if we're within the streak window (same day)
      if (isWithinStreakWindow(user.streak.lastTaskDate) && user.streak.tasksCompletedToday > 0) {
        user.streak.tasksCompletedToday -= 1;
        
        // Only decrease streak if all tasks for today are undone
        if (user.streak.tasksCompletedToday === 0 && user.streak.count > 0) {
          user.streak.count -= 1;
        }
        
        await user.save();
      }
    }

    res.json({ 
      task,
      streak: {
        count: (await User.findById(req.user)).streak.count,
        tasksCompletedToday: (await User.findById(req.user)).streak.tasksCompletedToday
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This code defines the task controller for handling CRUD operations on tasks.
// It includes methods to get all tasks, create a new task, update an existing task, and delete a task.