const express = require('express');
const router = express.Router();
const ClubLeader = require('../models/ClubLeaderModel');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "777"; 

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await ClubLeader.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (String(user.password) !== String(password)) {
            return res.status(400).json({ error: "Incorrect Password" });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username, clubName: user.clubName },
            SECRET_KEY,
            { expiresIn: "5h" } 
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
