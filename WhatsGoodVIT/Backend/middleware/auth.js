const express = require('express');
const router = express.Router();
const ClubLeader = require('../models/ClubLeaderModel');
const User = require('../models/NormalUserModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "777";
const bcrypt = require('bcrypt');

router.post('/register-user', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password' });
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create a new normal user
      const newUser = new User({ username, password });
      await newUser.save();
  
      res.status(201).json({ message: 'User registration successful' });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.post('/login-clubleader', async (req, res) => {
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

router.post('/login-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login request received:", req.body);

        // Find user by username
        const user = await User.findOne({ username });

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

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Attach the decoded user object (which includes role) to req.user
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
module.exports = router;
