const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// controllers/userController.js
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      totalXP: user.totalXP,
      level: user.level,
      xpToNextLevel: user.xpToNextLevel,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserXP = async (req, res) => {
  try {
    const xpPerLevel = 500; // XP required to level up
    const { xpAmount, resetStreak } = req.body;
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add XP
    user.totalXP += xpAmount;
    
    // Calculate level and XP to next level
    user.level = Math.floor(user.totalXP / xpPerLevel); // Assuming 500 XP per level
    user.xpToNextLevel = (user.level + 1) * xpPerLevel; // Next level XP requirement
    
    // Reset streak
    if (resetStreak) {
      user.streak = {
        count: 0,
        tasksCompletedToday: 0,
        lastTaskDate: null
      };
    }
    
    await user.save();
    
    res.json({
      totalXP: user.totalXP,
      level: user.level,
      xpToNextLevel: user.xpToNextLevel,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriendsStats = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('friends');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friendsStats = user.friends.map(friend => ({
      username: friend.username,
      totalXP: friend.totalXP,
      level: friend.level
    }));

    res.json(friendsStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    const { username } = req.body; // Accept username from the request body

    const user = await User.findById(req.user); // Get the current user
    const friend = await User.findOne({ username }); // Find the friend by username

    if (!user || !friend) {
      return res.status(404).json({ error: 'User or friend not found' });
    }

    // Prevent adding yourself as a friend
    if (user._id.toString() === friend._id.toString()) {
      return res.status(400).json({ error: 'Cannot add yourself as a friend' });
    }

    // Avoid adding duplicates
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Add the friend to the user's friends list
    user.friends.push(friend._id);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error in addFriend:', error.message); // Debugging log
    res.status(500).json({ error: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('friends');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friendsStats = user.friends.map(friend => ({
      username: friend.username,
      totalXP: friend.totalXP,
      level: friend.level
    }));

    // Optional: include the user themselves in the leaderboard
    friendsStats.push({
      username: user.username,
      totalXP: user.totalXP,
      level: user.level
    });

    // Sort by totalXP in descending order
    friendsStats.sort((a, b) => b.totalXP - a.totalXP);

    res.json(friendsStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserIdByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract username from request parameters
    console.log('Fetching user ID for username:', username); // Debugging log
    const user = await User.findOne({ username }); // Find user by username

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId: user._id }); // Return the user ID
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};