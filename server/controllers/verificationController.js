const admin = require('firebase-admin');

const verifyPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const sessionInfo = await admin.auth().createSessionCookie(req.body.idToken, { expiresIn: 86400 }); // Set expiration to 1 day
    const result = await admin.auth().verifyPhoneNumber(phoneNumber, sessionInfo);

    res.status(200).json({ sessionId: result.sessionInfo.uid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error verifying phone number.' });
  }
};

module.exports = {
  verifyPhoneNumber,
};
