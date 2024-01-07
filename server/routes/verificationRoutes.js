//verificationRoutes.js
const express = require('express');
const router = express.Router();
const { verifyPhoneNumber, verifyOTP } = require('../controllers/verificationController');

router.post('/verify-phone-number', verifyPhoneNumber);
router.post('/verify-otp', verifyOTP);

module.exports = router;
