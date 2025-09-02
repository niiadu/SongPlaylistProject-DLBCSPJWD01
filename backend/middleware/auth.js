// Import required dependencies
const jwt = require('jsonwebtoken');    // JWT token verification
const User = require('../models/User'); // User model

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user object to request
 * Protects routes that require user authentication
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by ID from token payload
    const user = await User.findById(decoded.userId);
    
    // Check if user still exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user object to request for use in route handlers
    req.user = user;
    next(); // Continue to next middleware/route handler
  } catch (error) {
    // Token verification failed
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Export middleware function
module.exports = auth;