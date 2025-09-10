const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  currency: { type: String, default: 'INR' },
  paidBy: { type: String, required: true },
  splitType: { type: String, default: 'equally' },
  date: { type: Date, default: Date.now },
  icon: { type: String, default: '💰' },
  category: { type: String },
  participants: [{ type: String }],
  customSplits: { type: Map, of: Number, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);