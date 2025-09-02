const mongoose = require('mongoose');   
const bcrypt = require('bcryptjs');    

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents in MongoDB
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,     
    unique: true,       
    trim: true,         
    minlength: 3,       
    maxlength: 20       
  },
  email: {
    type: String,
    required: true,     
    unique: true,       
    trim: true,         
    lowercase: true     
  },
  password: {
    type: String,
    required: true,     
    minlength: 6        
  }
}, {
  timestamps: true      
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