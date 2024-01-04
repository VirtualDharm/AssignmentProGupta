const Form = require('../models/Form');
const { sendEmail } = require('../utils/email');
const { validatePhoneNumber } = require('../utils/validation');
const admin = require('firebase-admin');

const submitForm = async (req, res) => {
  const { phoneNumber, idToken } = req.body;

  // Validate phone number
  if (!validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }

  // Verify phone number
  try {
    const sessionInfo = await admin.auth().createSessionCookie(idToken, { expiresIn: 86400 }); // Set expiration to 1 day
    const result = await admin.auth().verifyPhoneNumber(phoneNumber, sessionInfo);

    // Save form data to the database
    const newForm = await Form.create(req.body);

    // Send confirmation email
    const recipientEmail = req.body.email;
    const confirmationMessage = `Thank you for submitting the form. Your details have been received.`;

    await sendEmail(recipientEmail, confirmationMessage);

    res.status(201).json(newForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  submitForm,
};
