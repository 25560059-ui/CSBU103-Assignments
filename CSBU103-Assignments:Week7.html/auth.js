const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.mongo'); // Change to user.local if using db.json

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 6 chars, 1 number, 1 special char)
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

/**
 * POST /api/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation: Check if fields are provided
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Validation: Check email format
        if (!emailRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Validation: Check password strength
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters and contain at least 1 number and 1 special character'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date()
        });

        // Save user to database
        await newUser.save();

        // Return success response (don't send password back)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

module.exports = router;
