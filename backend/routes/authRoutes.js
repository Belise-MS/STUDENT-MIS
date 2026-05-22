// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkAuth } = require('../middleware/auth');

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Get current user (protected)
router.get('/me', checkAuth, authController.getCurrentUser);

module.exports = router;
