const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing and comparison
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating and verifying JWT tokens

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
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};