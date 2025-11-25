const User = require('../models/user');
const EmailService = require('../utils/emailService');

const authController = {
  async signup(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email address'
        });
      }

      // Create new user
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password
      });

      // Send welcome email (don't wait for it to complete)
      EmailService.sendWelcomeEmail(email, firstName, lastName);

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to TM2R Health.',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        }
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during account creation'
      });
    }
  },

  // ADD THIS NEW LOGIN FUNCTION
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Validate password
      const isValidPassword = await User.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last login
      const db = require('../config/database');
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      // Return user data (without password)
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  },

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving user information'
      });
    }
  },

  async getUsers(req, res) {
    try {
      // This would typically be protected and paginated
      const db = require('../config/database');
      const users = await new Promise((resolve, reject) => {
        db.all(
          'SELECT id, first_name, last_name, email, created_at FROM users ORDER BY created_at DESC',
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      res.json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving users'
      });
    }
  }
};

module.exports = authController;