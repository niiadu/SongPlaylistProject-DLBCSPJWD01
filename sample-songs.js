/**
 
 * Usage:
 * 1. Add recommended songs to the mongo db
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

// Define Song schema directly (to avoid path issues)
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

const Song = mongoose.model('Song', songSchema);

// Sample recommended songs data
const sampleSongs = [
    { title: "Hotel California", artist: "Eagles", isRecommended: true },
    { title: "Imagine", artist: "John Lennon", isRecommended: true },
    { title: "Billie Jean", artist: "Michael Jackson", isRecommended: true },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", isRecommended: true },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", isRecommended: true },
    { title: "Like a Rolling Stone", artist: "Bob Dylan", isRecommended: true },
    { title: "Good Vibrations", artist: "The Beach Boys", isRecommended: true },
    { title: "Yesterday", artist: "The Beatles", isRecommended: true },
    { title: "What's Going On", artist: "Marvin Gaye", isRecommended: true },
    { title: "Respect", artist: "Aretha Franklin", isRecommended: true },
    { title: "Hey Jude", artist: "The Beatles", isRecommended: true },
    { title: "Thriller", artist: "Michael Jackson", isRecommended: true },
    { title: "Don't Stop Believin'", artist: "Journey", isRecommended: true },
    { title: "Wonderwall", artist: "Oasis", isRecommended: true },
    { title: "Shape of You", artist: "Ed Sheeran", isRecommended: true },
    { title: "Blinding Lights", artist: "The Weeknd", isRecommended: true },
    { title: "Rolling in the Deep", artist: "Adele", isRecommended: true },
    { title: "Kaa Fo", artist: "Wiyaala", isRecommended: true },
    { title: "Sim So", artist: "Efya", isRecommended: true },
    { title: "Gyal Dem", artist: "Medikal", isRecommended: true },
    { title: "Performance", artist: "Fameye", isRecommended: true },
];

/**
 * Test MongoDB connection
 */
async function testConnection() {
    console.log('🔗 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            connectTimeoutMS: 10000,        // Connection timeout
        });
        
        console.log('✅ MongoDB connected successfully!');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return false;
    }
}

/**
 * Check if MongoDB service is running
 */
function checkMongoDBStatus() {
    console.log('\n📋 MongoDB Connection Troubleshooting:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. For local MongoDB, run: mongod');
    console.log('3. For MongoDB Atlas, check your connection string');
    console.log('4. Verify the database name in your connection string');
    console.log('5. Check if port 27017 is available (for local MongoDB)\n');
}

/**
 * Main function to populate database with sample songs
 */
async function populateDatabase() {
    console.log('🎵 Music Playlist Sample Songs Generator');
    console.log('=====================================\n');
    
    try {
        // Test connection first
        const isConnected = await testConnection();
        if (!isConnected) {
            checkMongoDBStatus();
            process.exit(1);
        }

        console.log('🧹 Cleaning existing recommended songs...');
        
        // Use a more specific deletion with timeout handling
        const deleteResult = await Song.deleteMany({ isRecommended: true }).maxTimeMS(10000);
        console.log(`✅ Removed ${deleteResult.deletedCount} existing recommended songs`);

        console.log('📝 Adding new recommended songs...');
        
        // Insert new recommended songs with timeout handling
        const insertedSongs = await Song.insertMany(sampleSongs, { 
            maxTimeMS: 15000,
            ordered: false 
        });
        
        console.log(`✅ Successfully added ${insertedSongs.length} recommended songs`);

        // Verify the insertion
        const totalRecommended = await Song.countDocuments({ isRecommended: true });
        console.log(`📊 Total recommended songs in database: ${totalRecommended}`);

        console.log('\n🎵 Added songs:');
        console.log('================');
        insertedSongs.forEach((song, index) => {
            console.log(`${index + 1}. "${song.title}" by ${song.artist}`);
        });

        console.log('\n✅ Database populated successfully!');
        console.log('🚀 You can now start your server and see the recommended songs in your app.');
        
    } catch (error) {
        console.error('\n❌ Error populating database:');
        
        if (error.name === 'MongooseServerSelectionError') {
            console.error('Connection Error: Cannot connect to MongoDB');
            checkMongoDBStatus();
        } else if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
            console.error('Timeout Error: Database operation took too long');
            console.log('💡 Try the following:');
            console.log('   - Restart MongoDB service');
            console.log('   - Check if MongoDB is accepting connections');
            console.log('   - Verify your MongoDB configuration');
        } else {
            console.error('Unexpected Error:', error.message);
        }
        
        process.exit(1);
    } finally {
        // Always close the connection
        try {
            await mongoose.connection.close();
            console.log('🔌 Database connection closed');
        } catch (err) {
            console.error('Error closing connection:', err.message);
        }
    }
}

// Handle script termination
process.on('SIGINT', async () => {
    console.log('\n⏹️  Script interrupted');
    try {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    } catch (err) {
        console.error('Error during cleanup:', err.message);
    }
    process.exit(0);
});

// Run the script
if (require.main === module) {
    populateDatabase();
}