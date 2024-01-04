const express = require('express');
const router = express.Router();
const { verifyPhoneNumber } = require('../controllers/verificationController');

router.post('/verify-phone-number', verifyPhoneNumber);

module.exports = router;
