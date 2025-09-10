const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  role: { type: String, default: 'Member' },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);