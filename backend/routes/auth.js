// Import required dependencies
const express = require('express');
const jwt = require('jsonwebtoken');    // JWT token creation
const User = require('../models/User'); // User model
const router = express.Router();       // Express router for modular routes

/**
 * POST /api/auth/register
 * User Registration Endpoint
 * Creates new user account and returns JWT token
 */
router.post('/register', async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    // Check if user already exists with same email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { userId: user._id },                           // Payload
      process.env.JWT_SECRET || 'your-secret-key',   // Secret key
      { expiresIn: '7d' }                            // Token expires in 7 days
    );

    // Send success response with token and user info
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/auth/login
 * User Login Endpoint
 * Authenticates user and returns JWT token
 */
router.post('/login', async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password using bcrypt comparison
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authenticated session
    const token = jwt.sign(
      { userId: user._id },                           // Payload
      process.env.JWT_SECRET || 'your-secret-key',   // Secret key
      { expiresIn: '7d' }                            // Token expires in 7 days
    );

    // Send success response with token and user info
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export router for use in server.js
module.exports = router;