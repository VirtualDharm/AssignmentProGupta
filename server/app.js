const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Firebase initialization
const serviceAccount = require('./path/to/your/firebase-admin-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com',
});

// Set up routes
app.use('/api/verification', verificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
