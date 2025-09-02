/**
 * Playlist Management JavaScript Module
 * Handles playlist-specific operations like adding/removing songs
 */

/**
 * Add Song to Playlist from Recommended List
 * Called when user clicks "Add to Playlist" button on recommended songs
 * @param {string} songId - ID of the song to add
 * @param {HTMLElement} buttonElement - The button that was clicked
 */
async function addSongToPlaylist(songId, buttonElement) {
    // Find the select element in the same song card
    const selectElement = buttonElement.parentNode.querySelector('.playlist-select');
    const playlistId = selectElement.value;
    
    // Validate playlist selection
    if (!playlistId) {
        alert('Please select a playlist first');
        return;
    }
    
    try {
        // Show loading state on button
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Adding...';
        buttonElement.disabled = true;
        
        // Send add song request to API
        const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ songId })
        });
        
        if (response.ok) {
            // Success - reload playlists and show feedback
            await loadUserPlaylists();
            showToast('Song added to playlist!', 'success');
            selectElement.value = ''; // Reset dropdown
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to add song', 'error');
        }
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        // Restore button state
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;
    }
}

/**
 * Remove Song from Playlist
 * Called when user clicks "Remove" button on songs in playlists
 * @param {string} playlistId - ID of the playlist
 * @param {string} songId - ID of the song to remove
 */
async function removeSongFromPlaylist(playlistId, songId) {
    // Confirm action with user
    if (!confirm('Are you sure you want to remove this song from the playlist?')) {
        return;
    }
    
    try {
        // Send remove song request to API
        const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            // Success - reload playlists and show feedback
            await loadUserPlaylists();
            showToast('Song removed from playlist', 'success');
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to remove song', 'error');
        }
    } catch (error) {
        console.error('Error removing song:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

/**
 * Delete Entire Playlist
 * Called when user clicks "Delete" button on playlist
 * @param {string} playlistId - ID of the playlist to delete
 */
async function deletePlaylist(playlistId) {
    // Confirm action with user
    if (!confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Send delete playlist request to API
        const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            // Success - reload playlists and show feedback
            await loadUserPlaylists();
            showToast('Playlist deleted successfully', 'success');
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to delete playlist', 'error');
        }
    } catch (error) {
        console.error('Error deleting playlist:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

/**
 * API Helper Function
 * Makes authenticated requests to the API
 * @param {string} endpoint - API endpoint to call
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} - Fetch response
 */
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // Default headers with authentication
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    // Merge provided options with defaults
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    return fetch(`${API_BASE_URL}${endpoint}`, config);
}