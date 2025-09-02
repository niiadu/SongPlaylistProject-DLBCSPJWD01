// Import MongoDB ODM
const mongoose = require('mongoose');

/**
 * Song Schema Definition
 * Defines the structure for song documents in MongoDB
 * Songs can be either recommended (pre-loaded) or custom (user-added)
 */
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,     // Song title is mandatory
    trim: true          // Remove leading/trailing whitespace
  },
  artist: {
    type: String,
    required: true,     // Artist name is mandatory
    trim: true          // Remove leading/trailing whitespace
  },
  isRecommended: {
    type: Boolean,
    default: false      // By default, songs are not recommended (user-created)
  }
}, {
  timestamps: true      // Add createdAt and updatedAt timestamps
});

// Export the Song model
module.exports = mongoose.model('Song', songSchema);