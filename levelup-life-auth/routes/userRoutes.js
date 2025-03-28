// routes/userRoutes.js
const express = require('express');
const { getUserStats, updateUserXP } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.get('/stats', getUserStats);
router.post('/xp', updateUserXP);

module.exports = router;
