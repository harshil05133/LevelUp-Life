const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Token expires after 1 hour
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
// This code defines a Mongoose schema and model for tokens in a token-based authentication system.
// It includes fields for the user ID, the token string, and a timestamp for when the token was created.