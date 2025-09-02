// Import required dependencies
const express = require('express');
const Playlist = require('../models/Playlist'); // Playlist model
const Song = require('../models/Song');         // Song model
const auth = require('../middleware/auth');     // Authentication middleware
const router = express.Router();

/**
 * GET /api/playlists
 * Fetch all playlists belonging to the authenticated user
 * Returns playlists with populated song details
 */
router.get('/', auth, async (req, res) => {
  try {
    // Find playlists for current user, populate song details, sort by newest first
    const playlists = await Playlist.find({ user: req.user._id })
      .populate('songs')                // Replace song IDs with full song objects
      .sort({ createdAt: -1 });        // Sort by creation date (newest first)
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/playlists
 * Create a new empty playlist for the authenticated user
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Create new playlist document
    const playlist = new Playlist({
      name,
      description,
      user: req.user._id,   // Associate with current user
      songs: []             // Start with empty songs array
    });
    
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/playlists/:playlistId/songs
 * Add a song to a specific playlist
 * Can add existing song by ID or create new song with title/artist
 */
router.post('/:playlistId/songs', auth, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId, title, artist } = req.body;
    
    // Find playlist belonging to current user
    const playlist = await Playlist.findOne({ 
      _id: playlistId, 
      user: req.user._id 
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    let song;
    if (songId) {
      // Use existing song by ID
      song = await Song.findById(songId);
    } else {
      // Find existing song or create new one
      song = await Song.findOne({ title, artist });
      if (!song) {
        song = new Song({ title, artist });
        await song.save();
      }
    }

    // Add song to playlist if not already present
    if (!playlist.songs.includes(song._id)) {
      playlist.songs.push(song._id);
      await playlist.save();
    }

    // Return updated playlist with populated song details
    await playlist.populate('songs');
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * DELETE /api/playlists/:playlistId/songs/:songId
 * Remove a song from a specific playlist
 */
router.delete('/:playlistId/songs/:songId', auth, async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    
    // Find playlist belonging to current user
    const playlist = await Playlist.findOne({ 
      _id: playlistId, 
      user: req.user._id 
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Remove song from playlist's songs array
    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();
    
    // Return updated playlist with populated song details
    await playlist.populate('songs');
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * DELETE /api/playlists/:playlistId
 * Delete an entire playlist
 */
router.delete('/:playlistId', auth, async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    // Find and delete playlist belonging to current user
    const playlist = await Playlist.findOneAndDelete({ 
      _id: playlistId, 
      user: req.user._id 
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export router
module.exports = router;