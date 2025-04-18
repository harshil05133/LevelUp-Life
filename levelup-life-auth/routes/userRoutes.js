// routes/userRoutes.js
const express = require('express');
const { 
  getUserStats, 
  updateUserXP, 
  getFriendsStats, 
  addFriend, 
  getLeaderboard,
  getUserIdByUsername
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.get('/stats', getUserStats);
router.post('/xp', updateUserXP);
router.get('/friends', getFriendsStats); // Get stats of all friends
router.post('/friends', addFriend); // Add a new friend
router.get('/leaderboard', getLeaderboard); // Get leaderboard of friends
router.get('/username/:username', getUserIdByUsername);//Get user ID by username

module.exports = router;
