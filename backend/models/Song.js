const mongoose = require('mongoose');

/**
 * Song Schema Definition
 * Defines the structure for song documents in MongoDB
 * Songs can be either recommended (pre-loaded) or custom (user-added)
 */
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,     
    trim: true          
  },
  artist: {
    type: String,
    required: true,     
    trim: true          
  },
  isRecommended: {
    type: Boolean,
    default: false      
  }
}, {
  timestamps: true      
});

// Export the Song model
module.exports = mongoose.model('Song', songSchema);