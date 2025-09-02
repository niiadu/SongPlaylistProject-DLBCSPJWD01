/**
 * Sample Songs Script
 * Run this script to populate your database with recommended songs
 * 
 * Usage:
 * 1. Ensure MongoDB is running
 * 2. Run: node sample-songs.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import Song model
const Song = require('./backend/models/Song');

// Sample recommended songs data
const sampleSongs = [
    { title: "Bohemian Rhapsody", artist: "Queen", isRecommended: true },
    { title: "Hotel California", artist: "Eagles", isRecommended: true },
    { title: "Imagine", artist: "John Lennon", isRecommended: true },
    { title: "Billie Jean", artist: "Michael Jackson", isRecommended: true },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", isRecommended: true },
    { title: "Stairway to Heaven", artist: "Led Zeppelin", isRecommended: true },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", isRecommended: true },
    { title: "Like a Rolling Stone", artist: "Bob Dylan", isRecommended: true },
    { title: "Purple Haze", artist: "Jimi Hendrix", isRecommended: true },
    { title: "Good Vibrations", artist: "The Beach Boys", isRecommended: true },
    { title: "Yesterday", artist: "The Beatles", isRecommended: true },
    { title: "What's Going On", artist: "Marvin Gaye", isRecommended: true },
    { title: "Respect", artist: "Aretha Franklin", isRecommended: true },
    { title: "Hey Jude", artist: "The Beatles", isRecommended: true },
    { title: "Thriller", artist: "Michael Jackson", isRecommended: true }
];

/**
 * Main function to populate database with sample songs
 */
async function populateDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jonasadjintettey_db_user:HnADAJghFggMmA8F@cluster0.a5996ht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB');

        // Clear existing recommended songs
        await Song.deleteMany({ isRecommended: true });
        console.log('Cleared existing recommended songs');

        // Insert new recommended songs
        const insertedSongs = await Song.insertMany(sampleSongs);
        console.log(`Successfully added ${insertedSongs.length} recommended songs`);

        // Display added songs
        console.log('\nAdded songs:');
        insertedSongs.forEach(song => {
            console.log(`- "${song.title}" by ${song.artist}`);
        });

        console.log('\n✅ Database populated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error populating database:', error);
        process.exit(1);
    }
}

// Run the script
populateDatabase();