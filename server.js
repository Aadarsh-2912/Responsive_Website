const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Logging //
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Connect to MongoDB //
mongoose.connect('mongodb://localhost/volunteer_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connected successfully');
});

// schema for the volunteer //
const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact_number: String,
  address: String
});
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

app.get('/volunteer', (req, res) => {
  res.sendFile(path.join(__dirname, 'volunteer.html'));
});

// POST //
app.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  try {
    const newVolunteer = new Volunteer({
      name: req.body.name,
      email: req.body.email,
      contact_number: req.body.contact_number,
      address: req.body.address
    });

    console.log('Created new volunteer object:', newVolunteer);

    const savedVolunteer = await newVolunteer.save();
    console.log('Volunteer saved successfully:', savedVolunteer);
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error saving volunteer:', error);
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
});

// GET //
app.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    console.log('Retrieved volunteers:', volunteers);
    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Error fetching volunteers', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
