/**
 * Authentication JavaScript Module
 * Handles user login, signup, and session management
 */

// Base URL for all API calls
const API_BASE_URL = 'http://localhost:2000/api';

/**
 * Page Load Handler
 * Redirects authenticated users away from auth pages
 */
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    // If user is logged in and on auth pages, redirect to dashboard
    if (token && (window.location.pathname.includes('login') || window.location.pathname.includes('signup'))) {
        window.location.href = 'dashboard.html';
    }
});

/**
 * Signup Form Handler
 * Processes user registration form submission
 */
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Extract form data
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            // Send registration request to backend
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            const messageDiv = document.getElementById('message');

            if (response.ok) {
                // Registration successful - store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message and redirect
                showMessage('Registration successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // Registration failed - show error message
                showMessage(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            // Network or other error
            showMessage('Network error. Please try again.', 'error');
        }
    });
}

/**
 * Login Form Handler
 * Processes user login form submission
 */
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Extract form data
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            // Send login request to backend
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful - store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message and redirect
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // Login failed - show error message
                showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            // Network or other error
            showMessage('Network error. Please try again.', 'error');
        }
    });
}

/**
 * Message Display Function (for auth pages)
 * Shows success or error messages to the user
 * @param {string} message - The message to display
 * @param {string} type - Either 'success' or 'error'
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
}