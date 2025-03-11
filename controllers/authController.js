const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const authController = {
    // 🟢 Register a New User
    register: (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        User.findByEmail(email, (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err.message });

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            User.create({ username, email, password: hashedPassword }, (err) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err.message });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    },

    // 🔑 Login User
    login: (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        User.findByEmail(email, (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err.message });
            if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

            // Generate Tokens
            const accessToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

            // Save Refresh Token
            User.saveRefreshToken(user.id, refreshToken, (err) => {
                if (err) return res.status(500).json({ message: 'Error saving refresh token' });
                res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
            });
        });
    },

    // 🔄 Refresh Token
    refreshToken: (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

        jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });

            User.getRefreshToken(decoded.id, (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err.message });
                if (!results.length || results[0].refresh_token !== refreshToken) {
                    return res.status(403).json({ message: 'Refresh token mismatch' });
                }

                const newAccessToken = jwt.sign({ id: decoded.id, email: decoded.email }, SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ accessToken: newAccessToken });
            });
        });
    },

    // 🚪 Logout User
    logout: (req, res) => {
        const { userId } = req.body;
        User.saveRefreshToken(userId, null, (err) => {
            if (err) return res.status(500).json({ message: 'Error clearing refresh token' });
            res.status(200).json({ message: 'Logged out successfully' });
        });
    }
};

module.exports = authController;
