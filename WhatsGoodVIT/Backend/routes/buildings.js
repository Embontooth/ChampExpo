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

// // Add new building
// router.post('/', auth, async (req, res) => {
//     try {
//         // Validate building name
//         if (!['AB1', 'AB2', 'AB3', 'Clock_Tower', 'MG'].includes(req.body.name)) {
//             return res.status(400).send({ 
//                 error: 'Invalid building name. Must be one of: AB1, AB2, AB3, Clock_Tower, MG' 
//             });
//         }

//         const building = new Building(req.body);
//         await building.save();
//         res.status(201).send(building);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

module.exports = router;
