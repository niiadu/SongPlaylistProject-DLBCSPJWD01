const mongoose = require('mongoose');

/**
 * Playlist Schema Definition
 * Defines the structure for playlist documents in MongoDB
 * Each playlist belongs to a user and contains references to songs
 */
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,     // Playlist name is mandatory
    trim: true          // Remove leading/trailing whitespace
  },
  description: {
    type: String,
    trim: true          // Optional description field
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User document
    ref: 'User',        // Links to User model
    required: true      // Every playlist must have an owner
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,  // Array of references to Song documents
    ref: 'Song'         // Links to Song model
  }]
}, {
  timestamps: true      // Add createdAt and updatedAt timestamps
});

// Export the Playlist model
module.exports = mongoose.model('Playlist', playlistSchema);