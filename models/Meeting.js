const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  date: Date,
  startTime: String,
  endTime: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
});

module.exports = mongoose.model('Meeting', meetingSchema);



