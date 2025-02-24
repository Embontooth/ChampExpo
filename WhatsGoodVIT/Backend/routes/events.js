const express = require('express');
const router = express.Router();
const Event = require('../models/EventModel');
const auth = require('../middleware/auth');

//Creating the event
router.post('/', auth, async (req, res) => {
  try {
    // Find building by name
    const building = await Building.findOne({ name: req.body.building });
    if (!building) {
      return res.status(400).send({ 
        error: 'Invalid building name. Must be one of: AB1, AB2, AB3, Clock_Tower, MG' 
      });
    }

    const event = new Event({
      ...req.body,
      createdBy: req.clubLeader._id,
      clubName: req.clubLeader.clubName,
      building: building._id
    });
    await event.save();
    await event.populate('building createdBy', 'name clubName'); 
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Getting the event
router.get('/', async (req, res) => {
  try {
      const now = new Date();
      const events = await Event.find({ endTime: { $gt: now } })
          .populate('building', 'name') // Fetch building name
          .populate('createdBy', 'clubName -_id') // Fetch clubName, hide _id
          .sort('startTime');
      res.json(events);
  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Get details wrt building ID (the name)
router.get('/building/:buildingId', async (req, res) => {
    try {
      const now = new Date();
      const building = await Building.findOne({ name: req.params.buildingName });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
      const events = await Event.find({
          building: req.params.buildingId,
          endTime: { $gt: now }
        }).populate('building', 'name').sort('startTime');
        res.json(events);
    } catch (error) {
      console.error('Error fetching events by building:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Get details wrt category
router.get('/category/:category', async (req, res) => {
    try {
      const now = new Date();
        const events = await Event.find({ 
            categories: req.params.category, 
            endTime: { $gt: now } 
        }).populate('building', 'name').sort('startTime');
      res.json(events);;
    } catch (error) {
      console.error('Error fetching events by category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //To search for elements
  router.get('/search', async (req, res) => {
    try {
      const now = new Date();
      const searchTerm = req.query.q || '';
      const events = await Event.find({
        //Any and all of the following
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } }, //search wrt building name
          { categories: { $regex: searchTerm, $options: 'i' } }, //search wrt categories
          { clubName: { $regex: searchTerm, $options: 'i' } } //search wrt clubName
        ],
        endTime: { $gt: now }
      }).populate('building', 'name').sort('startTime');
      res.send(events);
    } catch (error) {
      console.error('Error searching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;