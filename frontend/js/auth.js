// Authentication Logic
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');
const loginBtn = document.querySelector('.login-btn');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);

// Clear message on input
usernameInput.addEventListener('focus', clearMessage);
passwordInput.addEventListener('focus', clearMessage);

/**
 * Handle login form submission
 */
async function handleLogin(e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Validation
  if (!username || !password) {
    showError('Please fill in all fields');
    return;
  }

  if (password.length < 3) {
    showError('Password must be at least 3 characters');
    return;
  }

  // Disable button during request
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      showSuccess('Login successful! Redirecting...');
      // Store user info in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      // Redirect after 1 second
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showError(data.message || 'Login failed');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please try again.');
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

/**
 * Show error message
 */
function showError(message) {
  loginMessage.textContent = message;
  loginMessage.className = 'login-message error';
  loginMessage.style.display = 'block';
}

/**
 * Show success message
 */
function showSuccess(message) {
  loginMessage.textContent = message;
  loginMessage.className = 'login-message success';
  loginMessage.style.display = 'block';
}

/**
 * Clear message
 */
function clearMessage() {
  loginMessage.textContent = '';
  loginMessage.className = 'login-message';
  loginMessage.style.display = 'none';
}

/**
 * Check if user is already logged in
 */
async function checkUserSession() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      // User is already logged in, redirect to dashboard
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    // Not logged in, stay on login page
    console.log('User not authenticated');
  }
}

// Check session on page load
window.addEventListener('load', checkUserSession);
