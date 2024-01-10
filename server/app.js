const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 6000,
  max: 5,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(cors());

const URI = 'mongodb+srv://lama:lama@cluster0.fsrfj2t.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const FormSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: Date,
  phoneNumber: String,
  submissionTime: {
    type: Date,
    default: Date.now,
  },
});

const FormModel = mongoose.model('Form', FormSchema);

app.post('/api/formsubmission', async (req, res) => {
  try {
    const { name, email, dob, phoneNumber } = req.body;
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

app.get('/api/forms', async (req, res) => {
  try {
    const forms = await FormModel.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching submitted forms:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching submitted forms.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
