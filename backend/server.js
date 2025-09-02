const express = require('express');      
const cors = require('cors');           
const path = require('path');           
require('dotenv').config();             

// Import custom modules
const connectDB = require('./config/db');          // Database connection function
const authRoutes = require('./routes/auth');       // Authentication routes (login/register)
const playlistRoutes = require('./routes/playlists'); // Playlist management routes
const songRoutes = require('./routes/songs');      // Song management routes

// Initialize Express application
const app = express();

// Establish MongoDB connection
connectDB();

// Configure middleware
app.use(cors());                        // Allow frontend to communicate with backend
app.use(express.json());                // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static frontend files

// Configure API routes
app.use('/api/auth', authRoutes);       // Handle /api/auth/* requests (login, register)
app.use('/api/playlists', playlistRoutes); // Handle /api/playlists/* requests
app.use('/api/songs', songRoutes);     // Handle /api/songs/* requests

// Serve the main frontend page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});