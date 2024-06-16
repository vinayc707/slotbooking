const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('./models/User');
const Room = require('./models/Room');
const Meeting = require('./models/Meeting');

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb+srv://vinay:<passkey>@mainfree.gc0j0tz.mongodb.net/';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error', err));

// Function to check for collisions
async function hasCollision(meeting, rooms, users) {
  const existingMeetings = await Meeting.find({
    $and: [
      { date: meeting.date },
      { room: { $in: rooms } },
      { $or: [
        { startTime: { $lt: meeting.endTime, $gte: meeting.startTime } },
        { endTime: { $gt: meeting.startTime, $lte: meeting.endTime } }
      ]},
      { participants: { $nin: users } }
    ]
  });

  return existingMeetings.length > 0;
}

// Function to check if a user is available in a given time period
async function isUserAvailable(userId, date, startTime, endTime) {
  const meetings = await Meeting.find({
    date,
    participants: userId,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } }
    ]
  });

  return meetings.length === 0;
}

// Endpoint to schedule a meeting
app.post('/schedule', async (req, res) => {
  const { title, date, startTime, endTime, participants, room } = req.body;

  const newMeeting = new Meeting({ title, date, startTime, endTime, participants, room });

  if (await hasCollision(newMeeting)) {
    return res.status(400).send('Meeting time conflicts with an existing meeting.');
  }

  await newMeeting.save();
  res.send('Meeting scheduled successfully.');
});

// Endpoint to check user availability
app.post('/availability', async (req, res) => {
  const { userId, date, startTime, endTime } = req.body;

  try {
    const meetings = await Meeting.find({
      date,
      participants: userId,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ]
    });

    res.send(meetings.length === 0 ? 'Available' : 'Not Available');
  } catch (error) {
    res.status(500).send('An error occurred while checking availability');
  }
});

// Endpoint to create a room
app.post('/rooms', (req, res) => {
  const { name, capacity } = req.body;

  // Basic validation
  if (!name || !capacity) {
    return res.status(400).json({ error: 'Name and capacity are required' });
  }

  // Create new room object
  const newRoom = new Room({
    name,
    capacity
  });

  // Store room in "database"
  newRoom.save()
    .then(() => {
      res.status(201).json(newRoom);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while creating the room' });
    });
});


// Endpoint to create a user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
  
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    // Create new user object
    const newUser = new User({
      name,
      email
    });
  
    // Store user in the "database"
    newUser.save()
      .then(() => {
        res.status(201).json(newUser);
      })
      .catch((error) => {
        res.status(500).json({ error: 'An error occurred while creating the user' });
      });
  });

// Other CRUD endpoints for users and rooms can be added similarly...

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
