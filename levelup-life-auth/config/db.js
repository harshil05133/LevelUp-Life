// Import the mongoose library, which is an ODM (Object Data Modeling) library for MongoDB and Node.js

const mongoose = require('mongoose');


// Define an asynchronous function that will handle the database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { //connect using the .env file
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;