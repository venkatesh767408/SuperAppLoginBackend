// controllers/authController.js
const User = require('../model/user');
const OTP = require('../model/userOtp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res) => {
  const { name, email, password, globalRole } = req.body; // globalRole optional
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, Email and Password are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpDoc = new OTP({
      email,
      otp,
      type: 'register',
      pendingData: {
        name,
        hashedPassword,
        globalRole: globalRole || 'Fan',
      },
    });
    await otpDoc.save();

    await sendEmail(email, 'Registration OTP', `Your OTP for registration is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyRegistration = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpDoc = await OTP.findOne({ email, otp, type: 'register' });
    if (!otpDoc) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const { name, hashedPassword, globalRole } = otpDoc.pendingData;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      globalRole,
    });
    await user.save();

    await OTP.deleteOne({ _id: otpDoc._id });

    const token = jwt.sign({ id: user._id, globalRole: user.globalRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token , name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, globalRole: user.globalRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token , name: user.name, email: user.email});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    const otp = generateOTP();
    const otpDoc = new OTP({ email, otp, type: 'reset' });
    await otpDoc.save();

    await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyOtpReset = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const otpDoc = await OTP.findOne({ email, otp, type: 'reset' });
    if (!otpDoc) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.findOne({ email });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    await OTP.deleteOne({ _id: otpDoc._id });

    res.status(200).json({ resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  let resetToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    resetToken = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'No reset token provided' });
  }

  const { newPassword } = req.body; // Still get newPassword from body

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

   
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
module.exports = {
  register,
  verifyRegistration,
  login,
  forgotPassword,
  verifyOtpReset,
  resetPassword,
};