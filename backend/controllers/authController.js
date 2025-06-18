const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../server'); // Import JWT_SECRET from server.js

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const existingUser = await userModel.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await userModel.create(username, hashedPassword);

        res.status(201).json({ message: 'User registered successfully!', userId });
    } catch (error) {
        console.error('Error during user registration:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await userModel.findByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Logged in successfully!', token, userId: user.id, username: user.username });
    } catch (error) {
        console.error('Error during user login:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
