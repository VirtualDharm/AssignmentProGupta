// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 6000, // 1 minute
  max: 5, // 5 requests per minute
});

app.use(limiter);
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const URI = 'mongodb+srv://lama:lama@cluster0.fsrfj2t.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a mongoose schema
const FormSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: Date,
  phoneNumber: String,
});

const FormModel = mongoose.model('Form', FormSchema);
// Handle form submission
app.post('/api/formsubmission', async (req, res) => {
  try {
    const { name, email, dob, phoneNumber } = req.body;
    // Save form data to MongoDB
    const formData = new FormModel({
      name,
      email,
      dob,
      phoneNumber,
    });
    await formData.save();
    res.status(200).json({ success: true, message: 'Form data saved successfully.' });
  } catch (error) {
    console.error('Error handling form submission:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing the form submission.' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
