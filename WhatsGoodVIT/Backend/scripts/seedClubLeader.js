require('dotenv').config();
const mongoose = require('mongoose');
const ClubLeader = require('../models/ClubLeaderModel'); // Adjust path if needed

const clubLeadersData = [
    { username: 'John Doe', password: '123', clubName: 'Coding Club' },
    { username: 'Jane Smith', password: '456', clubName: 'Robotics Club' },
    { username: 'Alice Johnson', password: '789', clubName: 'Math Club' },
];

async function seedClubLeader() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await ClubLeader.deleteMany({});
        console.log('Cleared existing club leaders');

        await ClubLeader.insertMany(clubLeadersData);
        console.log('Club leaders seeded successfully');
    } catch (error) {
        console.error('Error seeding club leaders:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
}

seedClubLeader();