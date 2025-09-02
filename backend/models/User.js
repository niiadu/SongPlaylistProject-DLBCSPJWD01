// Import required dependencies
const mongoose = require('mongoose');   // MongoDB ODM
const bcrypt = require('bcryptjs');    // Password hashing library

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents in MongoDB
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,     // Username is mandatory
    unique: true,       // No duplicate usernames allowed
    trim: true,         // Remove whitespace from beginning/end
    minlength: 3,       // Minimum 3 characters
    maxlength: 20       // Maximum 20 characters
  },
  email: {
    type: String,
    required: true,     // Email is mandatory
    unique: true,       // No duplicate emails allowed
    trim: true,         // Remove whitespace
    lowercase: true     // Convert to lowercase for consistency
  },
  password: {
    type: String,
    required: true,     // Password is mandatory
    minlength: 6        // Minimum 6 characters for security
  }
}, {
  timestamps: true      // Automatically add createdAt and updatedAt fields
});

/**
 * Pre-save middleware
 * Hash the password before saving to database for security
 * Only runs if password field has been modified
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Hash password with salt rounds of 12 (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Instance method to compare entered password with hashed password
 * Used during login to verify user credentials
 */
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Export the User model for use in other files
module.exports = mongoose.model('User', userSchema);