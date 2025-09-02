/**
 * Dashboard JavaScript Module - Improved Playlist-First Workflow
 * Guides users to create playlists first, then add songs
 */

// Base URL for all API calls
const API_BASE_URL = 'http://localhost:2000/api';

// Global variables to store application state
let currentUser = null;
let recommendedSongs = [];
let userPlaylists = [];

/**
 * Page Initialization
 * Runs when the dashboard page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...');
    
    // Check if user is authenticated
    if (!checkAuthentication()) {
        return; // Stop execution if not authenticated
    }
    
    // Initialize dashboard
    initializeDashboard();
});

/**
 * Initialize Dashboard
 * Loads all necessary data and sets up event listeners
 */
async function initializeDashboard() {
    try {
        // Load user data first
        loadUserData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load data from API
        await Promise.all([
            loadRecommendedSongs(),
            loadUserPlaylists()
        ]);
        
        // Update UI based on playlist availability
        updateUIBasedOnPlaylists();
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Error loading dashboard. Please refresh the page.', 'error');
    }
}

/**
 * Authentication Check
 * Verifies user has valid token, redirects to login if not
 */
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
        console.log('No authentication data found, redirecting to login');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        currentUser = JSON.parse(userStr);
        console.log('User authenticated:', currentUser.username);
        return true;
    } catch (error) {
        console.error('Invalid user data:', error);
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
}

/**
 * Load and Display User Information
 */
function loadUserData() {
    if (currentUser && currentUser.username) {
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${currentUser.username}!`;
        }
    }
}

/**
 * Event Listeners Setup
 */
function setupEventListeners() {
    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Create playlist form handler
    const createPlaylistForm = document.getElementById('createPlaylistForm');
    if (createPlaylistForm) {
        createPlaylistForm.addEventListener('submit', handleCreatePlaylist);
    }
    
    // Add custom song form handler
    const addSongForm = document.getElementById('addSongForm');
    if (addSongForm) {
        addSongForm.addEventListener('submit', handleAddCustomSong);
    }
}

/**
 * Update UI Based on Playlist Availability
 * Shows/hides messages based on whether user has playlists
 */
function updateUIBasedOnPlaylists() {
    const noPlaylistsMessage = document.getElementById('noPlaylistsMessage');
    const gettingStartedMessage = document.getElementById('gettingStartedMessage');
    const addSongForm = document.getElementById('addSongForm');
    
    const hasPlaylists = userPlaylists && userPlaylists.length > 0;
    
    // Show/hide "no playlists" message for add song section
    if (noPlaylistsMessage) {
        noPlaylistsMessage.style.display = hasPlaylists ? 'none' : 'block';
    }
    
    // Show/hide "getting started" message
    if (gettingStartedMessage) {
        gettingStartedMessage.style.display = hasPlaylists ? 'none' : 'block';
    }
    
    // Enable/disable add song form
    if (addSongForm) {
        const inputs = addSongForm.querySelectorAll('input, select, button');
        inputs.forEach(input => {
            if (input.id !== 'targetPlaylist') {
                input.disabled = !hasPlaylists;
                if (!hasPlaylists) {
                    input.style.opacity = '0.6';
                    input.title = 'Create a playlist first to add songs';
                } else {
                    input.style.opacity = '1';
                    input.title = '';
                }
            }
        });
    }
}

/**
 * Fill Playlist Name (for suggestion buttons)
 */
function fillPlaylistName(name) {
    const playlistNameInput = document.getElementById('playlistName');
    if (playlistNameInput) {
        playlistNameInput.value = name;
        playlistNameInput.focus();
    }
}

/**
 * Logout Handler
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

/**
 * Load Recommended Songs
 */
async function loadRecommendedSongs() {
    const container = document.getElementById('recommendedSongs');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading recommended songs...</div>';
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/songs/recommended`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            recommendedSongs = await response.json();
            displayRecommendedSongs();
        } else if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading recommended songs:', error);
        container.innerHTML = '<div class="empty-state">Error loading songs. Please try refreshing the page.</div>';
    }
}

/**
 * Display Recommended Songs
 */
function displayRecommendedSongs() {
    const container = document.getElementById('recommendedSongs');
    if (!container) return;
    
    if (!recommendedSongs || recommendedSongs.length === 0) {
        container.innerHTML = '<div class="empty-state">No recommended songs available</div>';
        return;
    }
    
    const songsHTML = recommendedSongs.map(song => `
        <div class="song-card">
            <div class="song-info">
                <h4>${escapeHtml(song.title)}</h4>
                <p>by ${escapeHtml(song.artist)}</p>
            </div>
            <div class="song-actions">
                <select class="playlist-select" data-song-id="${song._id}">
                    <option value="">Choose playlist</option>
                </select>
                <button class="btn btn-success btn-small" onclick="addSongToPlaylist('${song._id}', this)">
                    Add to Playlist
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = songsHTML;
    updatePlaylistSelects();
}

/**
 * Load User Playlists
 */
async function loadUserPlaylists() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/playlists`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            userPlaylists = await response.json();
            displayUserPlaylists();
            updatePlaylistSelects();
            updateUIBasedOnPlaylists(); // Update UI after loading playlists
        } else if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading playlists:', error);
        showToast('Error loading playlists', 'error');
    }
}

/**
 * Display User Playlists
 */
function displayUserPlaylists() {
    const container = document.getElementById('userPlaylists');
    if (!container) return;
    
    if (!userPlaylists || userPlaylists.length === 0) {
        container.innerHTML = ''; // Let the getting started message show instead
        return;
    }
    
    const playlistsHTML = userPlaylists.map(playlist => `
        <div class="playlist-card">
            <div class="playlist-header">
                <div>
                    <h3>${escapeHtml(playlist.name)}</h3>
                    ${playlist.description ? `<p style="color: #666; margin: 5px 0 0 0;">${escapeHtml(playlist.description)}</p>` : ''}
                </div>
                <button class="btn btn-danger btn-small" onclick="deletePlaylist('${playlist._id}')">
                    🗑️ Delete
                </button>
            </div>
            <div class="playlist-info">
                <small style="color: #666;">
                    📊 ${playlist.songs ? playlist.songs.length : 0} song(s) • 
                    Created ${formatDate(playlist.createdAt)}
                </small>
            </div>
            <div class="playlist-songs">
                ${playlist.songs && playlist.songs.length > 0 ? 
                    playlist.songs.map(song => `
                        <div class="playlist-song">
                            <div class="song-details">
                                <strong>${escapeHtml(song.title || 'Unknown Title')}</strong>
                                <small>by ${escapeHtml(song.artist || 'Unknown Artist')}</small>
                            </div>
                            <button class="btn btn-danger" onclick="removeSongFromPlaylist('${playlist._id}', '${song._id}')" title="Remove song from playlist">
                                ❌
                            </button>
                        </div>
                    `).join('') : 
                    `<div class="empty-state" style="padding: 20px; background: #f8f9fa;">
                        <p style="color: #666; margin: 0;">
                            🎵 This playlist is empty.<br>
                            <small>Add songs using the form above!</small>
                        </p>
                    </div>`
                }
            </div>
        </div>
    `).join('');
    
    container.innerHTML = playlistsHTML;
}

/**
 * Update Playlist Select Dropdowns
 */
function updatePlaylistSelects() {
    const selects = document.querySelectorAll('.playlist-select');
    const targetPlaylist = document.getElementById('targetPlaylist');
    
    // Generate options HTML
    const optionsHTML = userPlaylists.map(playlist => 
        `<option value="${playlist._id}">${escapeHtml(playlist.name)}</option>`
    ).join('');
    
    // Update recommended songs dropdowns
    selects.forEach(select => {
        const currentValue = select.value;
        if (userPlaylists.length === 0) {
            select.innerHTML = '<option value="">Create a playlist first</option>';
            select.disabled = true;
        } else {
            select.innerHTML = '<option value="">Choose playlist</option>' + optionsHTML;
            select.disabled = false;
            if (currentValue) select.value = currentValue;
        }
    });
    
    // Update custom song form dropdown
    if (targetPlaylist) {
        const currentValue = targetPlaylist.value;
        if (userPlaylists.length === 0) {
            targetPlaylist.innerHTML = '<option value="">Create a playlist first</option>';
            targetPlaylist.disabled = true;
        } else {
            targetPlaylist.innerHTML = '<option value="">Select playlist</option>' + optionsHTML;
            targetPlaylist.disabled = false;
            if (currentValue) targetPlaylist.value = currentValue;
        }
    }
}

/**
 * Create Playlist Handler
 */
async function handleCreatePlaylist(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('playlistName');
    const descriptionInput = document.getElementById('playlistDescription');
    
    if (!nameInput) {
        showToast('Form elements not found', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    
    if (!name) {
        showToast('Please enter a playlist name', 'error');
        nameInput.focus();
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });
        
        if (response.ok) {
            // Success - clear form and reload playlists
            document.getElementById('createPlaylistForm').reset();
            await loadUserPlaylists();
            showToast(`🎵 Playlist "${name}" created! Now you can add songs to it.`, 'success');
            
            // Focus on the song title input to guide user to next step
            setTimeout(() => {
                const songArtistInput = document.getElementById('songArtist');
                if (songArtistInput && !songArtistInput.disabled) {
                    songArtistInput.focus();
                    songArtistInput.placeholder = `Add a song to "${name}"...`;
                }
            }, 1000);
            
        } else if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to create playlist', 'error');
        }
    } catch (error) {
        console.error('Error creating playlist:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

/**
 * Add Custom Song Handler
 */
async function handleAddCustomSong(event) {
    event.preventDefault();
    
    // Check if user has playlists first
    if (!userPlaylists || userPlaylists.length === 0) {
        showToast('Please create a playlist first before adding songs!', 'error');
        document.getElementById('playlistName').focus();
        return;
    }
    
    const artistInput = document.getElementById('songArtist');
    const titleInput = document.getElementById('songTitle');
    const playlistSelect = document.getElementById('targetPlaylist');
    
    if (!artistInput || !titleInput || !playlistSelect) {
        showToast('Form elements not found', 'error');
        return;
    }
    
    const artist = artistInput.value.trim();
    const title = titleInput.value.trim();
    const playlistId = playlistSelect.value;
    
    // Validate input
    if (!artist || !title) {
        showToast('Please enter both artist name and song title', 'error');
        if (!artist) artistInput.focus();
        else titleInput.focus();
        return;
    }
    
    if (!playlistId) {
        showToast('Please select a playlist to add the song to', 'error');
        playlistSelect.focus();
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, artist })
        });
        
        if (response.ok) {
            // Success - clear form and reload playlists
            document.getElementById('addSongForm').reset();
            await loadUserPlaylists();
            
            const playlistName = userPlaylists.find(p => p._id === playlistId)?.name || 'playlist';
            showToast(`🎵 "${title}" by ${artist} added to "${playlistName}"!`, 'success');
            
            // Focus back on artist input for easy addition of more songs
            artistInput.focus();
            
        } else if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to add song', 'error');
        }
    } catch (error) {
        console.error('Error adding song:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

/**
 * Format Date Helper
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
}

/**
 * Toast Notification Function
 */
function showToast(message, type) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: '350px',
        wordWrap: 'break-word'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}

/**
 * HTML Escaping Function
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return String(text || '');
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Global functions for onclick handlers
 */
window.fillPlaylistName = fillPlaylistName;
window.addSongToPlaylist = addSongToPlaylist;
window.removeSongFromPlaylist = removeSongFromPlaylist;
window.deletePlaylist = deletePlaylist;

// Fallback functions if playlist.js doesn't load
if (typeof addSongToPlaylist === 'undefined') {
    window.addSongToPlaylist = async function(songId, buttonElement) {
        showToast('Playlist functions not loaded. Please refresh the page.', 'error');
    };
}

if (typeof removeSongFromPlaylist === 'undefined') {
    window.removeSongFromPlaylist = async function(playlistId, songId) {
        showToast('Playlist functions not loaded. Please refresh the page.', 'error');
    };
}

if (typeof deletePlaylist === 'undefined') {
    window.deletePlaylist = async function(playlistId) {
        showToast('Playlist functions not loaded. Please refresh the page.', 'error');
    };
}