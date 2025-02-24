const mongoose = require('mongoose');
const ClubLeader = require('../models/ClubLeader'); // Adjust the path as necessary

const clubLeadersData = [
    {
        username: 'John Doe',
        password: '123',
        clubName: 'Coding Club',
    },
    {
        username: 'Jane Smith',
        password: '456',
        clubName: 'Robotics Club',
    },
    {
        username: 'Alice Johnson',
        password: '789',
        clubName: 'Math Club',
    },
];

async function seedClubLeader() {
    try {
        await ClubLeader.deleteMany({}); // Clear existing data
        const clubLeader = new ClubLeader(clubLeaderData);
        await clubLeader.save();
        console.log('Club leader seeded successfully');
    } catch (error) {
        console.error('Error seeding club leader:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedClubLeader();