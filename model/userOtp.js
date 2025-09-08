// models/OTP.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['register', 'reset'],
    required: true,
  },
  pendingData: {
    type: Object, // For registration: {name, hashedPassword, globalRole (optional)}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Expires after 5 minutes
  },
});

module.exports = mongoose.model('OTP', otpSchema);