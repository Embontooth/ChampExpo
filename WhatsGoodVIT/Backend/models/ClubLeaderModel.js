const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //For password Hashing

const ClubLeaderSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clubName: { type: String, required: true },
  // role: { type: String, default: "clubLeader", immutable: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
}, {
  timestamps: true
});

ClubLeaderSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('ClubLeader', ClubLeaderSchema);
