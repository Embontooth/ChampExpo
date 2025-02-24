const express = require('express');
const router = express.Router();
const Building = require('../models/BuildingModel');
const auth = require('../middleware/auth');

// Get all buildings
router.get('/', async (req, res) => {
    try {
        const buildings = await Building.find({}).sort('name');
        res.send(buildings);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
