const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing and comparison
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating and verifying JWT tokens
const crypto = require('crypto');
const Token = require('../models/tokenModel');
const nodemailer = require('nodemailer');

//register function that handles user registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body; // Extract username, email, and password from the request body

  //try to create and save a new user to the database
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//login function that handles user login/authentication
exports.login = async (req, res) => {
  const { email, password } = req.body;

  //try to find a user with the provided email
  //if the user is found, compare the provided password with the hashed password in the database
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If authentication is successful, create a JWT token
    // The token contains the user's ID and is signed with a secret key
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    //return token to client
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Delete any existing tokens for this user
    await Token.deleteMany({ userId: user._id });
    
    // Create a new token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save the token to the database
    await new Token({
      userId: user._id,
      token: resetToken,
    }).save();
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Send email
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>You requested a password reset</h1>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
        <p>This link is valid for 1 hour</p>
      `
    });
    
    res.status(200).json({ message: 'Password reset link sent to your email address' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const resetToken = await Token.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const resetToken = await Token.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Find the user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Update password
    user.password = password;
    await user.save();
    
    // Delete the token
    await resetToken.deleteOne();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};