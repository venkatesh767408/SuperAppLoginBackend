const express = require("express");
const router = express.Router();


// authenticaation 
const {
  register,
  verifyRegistration,
  login,
  forgotPassword,
  verifyOtpReset,
  resetPassword,
} = require('../controller/userAuth');

// user registration and login
router.post('/user/register', register);
router.post('/user/verify-registration', verifyRegistration);
router.post('/user/login', login);
router.post('/user/forgot-password', forgotPassword);
router.post('/user/verify-otp-reset', verifyOtpReset);
router.post('/user/reset-password', resetPassword);

// User management
module.exports = router;
