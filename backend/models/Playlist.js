const mongoose = require('mongoose');

/**
 * Playlist Schema Definition
 * Defines the structure for playlist documents in MongoDB
 * Each playlist belongs to a user and contains references to songs
 */
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,     
    trim: true          
  },
  description: {
    type: String,
    trim: true          
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',        
    required: true      
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Song'         
  }]
}, {
  timestamps: true      
});

// Export the Playlist model
module.exports = mongoose.model('Playlist', playlistSchema);