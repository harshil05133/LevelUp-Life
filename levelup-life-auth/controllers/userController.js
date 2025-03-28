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
      xpToNextLevel: user.xpToNextLevel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserXP = async (req, res) => {
  try {
    const { xpAmount } = req.body;
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add XP
    user.totalXP += xpAmount;
    
    // Calculate level and XP to next level
    user.level = Math.floor(user.totalXP / 500); // Assuming 500 XP per level
    user.xpToNextLevel = (user.level + 1) * 500; // Next level XP requirement
    
    await user.save();
    
    res.json({
      totalXP: user.totalXP,
      level: user.level,
      xpToNextLevel: user.xpToNextLevel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
