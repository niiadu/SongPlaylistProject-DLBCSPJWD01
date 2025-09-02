// Import MongoDB ODM (Object Document Mapper)
const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB database
 * Uses environment variable MONGODB_URI or defaults to local MongoDB instance
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/music-playlist');
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Log error and exit process if connection fails
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export the connection function for use in server.js
module.exports = connectDB;