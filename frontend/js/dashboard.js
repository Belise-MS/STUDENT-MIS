// Dashboard Logic
const API_URL = 'http://localhost:3000/api';

// Initialize dashboard on page load
window.addEventListener('load', () => {
  document.body.classList.add('dashboard-page');
  checkUserSession();
  loadDashboardStats();
  setupEventListeners();
});

/**
 * Check if user is authenticated
 */
async function checkUserSession() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      // Not logged in, redirect to login
      window.location.href = 'index.html';
      return;
    }

    const data = await response.json();
    if (data.success && data.user) {
      displayUserInfo(data.user);
    }
  } catch (error) {
    console.error('Session check error:', error);
    window.location.href = 'index.html';
  }
}

/**
 * Display user information on dashboard
 */
function displayUserInfo(user) {
  document.getElementById('userName').textContent = user.fullName || user.username;
  document.getElementById('userRole').textContent = (user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1);
  document.getElementById('welcomeText').textContent = `Welcome back, ${(user.fullName || user.username).split(' ')[0]}!`;
}

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {
  try {
    // In a real app, this would call backend API
    // For now, we'll use mock data that simulates API response
    const stats = {
      totalStudents: 45,
      newStudents: 3,
      activeStatus: 100,
      lastUpdated: new Date()
    };

    displayStats(stats);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

/**
 * Display statistics on dashboard
 */
function displayStats(stats) {
  // Update total students
  document.getElementById('totalStudents').textContent = stats.totalStudents;

  // Update new students (this month)
  document.getElementById('newStudents').textContent = stats.newStudents;

  // Update active status
  document.getElementById('activeStatus').textContent = stats.activeStatus + '%';

  // Update last updated time
  const lastUpdatedElement = document.getElementById('lastUpdated');
  const now = new Date();
  const diffMs = now - stats.lastUpdated;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins === 0) {
    lastUpdatedElement.textContent = 'Just now';
  } else if (diffMins < 60) {
    lastUpdatedElement.textContent = `${diffMins}m ago`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    lastUpdatedElement.textContent = `${hours}h ago`;
  } else {
    lastUpdatedElement.textContent = stats.lastUpdated.toLocaleDateString();
  }

  // Update backup time
  const now2 = new Date();
  const backupTime = now2.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  document.getElementById('backupTime').textContent = backupTime;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const logoutBtns = document.querySelectorAll('#logoutBtn, #sidebarLogout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });
}

/**
 * Handle logout
 */
async function handleLogout(e) {
  e.preventDefault();

  if (!confirm('Are you sure you want to logout?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = 'index.html';
  }
}

/**
 * Refresh stats periodically (every 5 minutes)
 */
setInterval(() => {
  loadDashboardStats();
}, 5 * 60 * 1000);
