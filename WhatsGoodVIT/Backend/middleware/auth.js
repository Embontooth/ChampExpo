const express = require('express');
const router = express.Router();
const ClubLeader = require('../models/ClubLeaderModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = "777"; 

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login request received:", req.body);

        // Find user by username
        const user = await ClubLeader.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        console.log("User found:", user);

        // Compare hashed password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect Password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, clubName: user.clubName },
            SECRET_KEY,
            { expiresIn: "5h" } 
        );

        console.log("Generated Token:", token);
        res.status(200).json({ token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
