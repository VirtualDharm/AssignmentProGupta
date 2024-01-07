// verificationController.js
const admin = require('firebase-admin');
const crypto = require('crypto');

const verifyPhoneNumber = async (req, res) => {
  console.log(req.body)
  const { phoneNumber } = req.body;
  console.log("phoneNumber : ",phoneNumber)

  try {
    const result = await admin.auth().getUserByPhoneNumber(phoneNumber);
    // If user exists, send OTP
    const sessionInfo = await admin.auth().createSessionCookie(result.uid, { expiresIn: 600 }); // Set expiration to 10 minutes
    const otp = generateOTP();
    // Send OTP to the user (You can use a messaging service or any other preferred method)
    res.status(200).json({ sessionId: sessionInfo, otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error verifying phone number. check point 2' });
  }
};

const verifyOTP = async (req, res) => {
  const { sessionId, otp } = req.body;
  try {
    await admin.auth().verifySessionCookie(sessionId, true);
    // Implement logic to verify OTP (compare with the one sent to the user)
    res.status(200).json({ message: 'Phone number verified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error verifying OTP.' });
  }
};

const generateOTP = () => {
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase(); // 3 bytes converted to hex
  return otp.slice(0, 6);
};

module.exports = {
  verifyPhoneNumber,
  verifyOTP,
};
