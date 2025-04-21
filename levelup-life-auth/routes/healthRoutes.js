const express = require('express');
const router = express.Router();

// Import controller functions for handling health logs
const healthController = require('../controllers/healthController');

// Import middleware to verify user is logged in
const authMiddleware = require('../middleware/authMiddleware');


// Create a new health log entry

router.post('/', authMiddleware, healthController.createHealthLog);


// Get all health logs for the current user
router.get('/', authMiddleware, healthController.getHealthLogs);

// Export the router
module.exports = router;