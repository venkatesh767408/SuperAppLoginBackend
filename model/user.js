// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    globalRole: {
      type: String,
      enum: ['Fan', 'Parent'],
      default: 'Fan',
    },
    // Contextual Roles: linked to teams/games
    teams: [
      {
        teamId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
        },
        role: {
          type: String,
          enum: ['Coach', 'Player'],
        },
      },
    ],
    subscribedTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);