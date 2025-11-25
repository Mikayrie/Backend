const express = require('express');
const authController = require('../controllers/authController');
const { validateSignup } = require('../middleware/validation');

const router = express.Router();

// Signup route
router.post('/signup', validateSignup, authController.signup);

// Login route
router.post('/login', authController.login);

// Get user by ID
router.get('/user/:id', authController.getUser);

// Get all users (for admin purposes)
router.get('/users', authController.getUsers);

module.exports = router;