// Import the Express framework

const express = require('express');
const { register, login, forgotPassword, verifyResetToken, resetPassword } = require('../controllers/authController');
const router = express.Router(); // Create a new router instance
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Define a route for handling POST requests to '/register' when a POST request is made to this endpoint (e.g., '/api/auth/register'),
// the register function from authController will be executed
// This route is used for creating new user accounts
router.post('/register', register);

//same thing but for login
// This route is used for authenticating users and providing JWT tokens
router.post('/login', login);

module.exports = router;