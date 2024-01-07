//app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const verificationRoutes = require('./routes/verificationRoutes');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
// Firebase initialization
const serviceAccount = require('./assignmentproguptag-firebase-adminsdk-acdaj-5c71eaf9f5.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://assignmentproguptag-default-rtdb.asia-southeast1.firebasedatabase.app',
});

// Set up routes
app.use('/api/verification', verificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
