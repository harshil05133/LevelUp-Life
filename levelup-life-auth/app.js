//import express framework, database connection function, auth routes, the .env file, cors, 
// and create the express app

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const app = express();

//load the .env file into process.env
dotenv.config();


// Connect to MongoDB
connectDB();

// Middleware
//parse incoming JSON data before the routes
//enable CORS to allow requests from the frontend
app.use(express.json());
app.use(cors());

// mount the auth routes at the /api/auth endpoint
app.use('/api/auth', authRoutes);

// mount the task routes at the /api/tasks endpoint
app.use('/api/tasks', taskRoutes);

//set the port for the backend server
//start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mount the user routes at the /api/user endpoint
app.use('/api/user', userRoutes);

// mount the health routes at the /api/health endpoint
app.use('/api/health', healthRoutes);
