// Import required dependencies
const express = require('express');
const Song = require('../models/Song');     // Song model
const auth = require('../middleware/auth'); // Authentication middleware
const router = express.Router();

/**
 * GET /api/songs/recommended
 * Fetch all recommended songs for display to users
 * Requires authentication
 */
router.get('/recommended', auth, async (req, res) => {
  try {
    // Find all songs marked as recommended
    const songs = await Song.find({ isRecommended: true });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/songs
 * Create a new song (either recommended or custom)
 * Requires authentication
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, artist, isRecommended = false } = req.body;
    
    // Create new song document
    const song = new Song({ title, artist, isRecommended });
    await song.save();
    
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/songs
 * Fetch all songs in the database
 * Requires authentication
 */
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export router
module.exports = router;