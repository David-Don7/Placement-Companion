const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update streak logic
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    user.lastActive = now;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        college: user.college,
        branch: user.branch,
        year: user.year,
        cgpa: user.cgpa,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        college: user.college,
        branch: user.branch,
        year: user.year,
        cgpa: user.cgpa,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, college, branch, year, cgpa } = req.body;
    const user = req.user;
    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;
    if (cgpa !== undefined) user.cgpa = cgpa;
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        cgpa: user.cgpa,
        streak: user.streak
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/auth/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/auth/account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    // Clean up related data
    const mongoose = require('mongoose');
    const uid = req.user._id;
    await mongoose.model('QuizResult').deleteMany({ userId: uid });
    await mongoose.model('DSAProgress').deleteMany({ userId: uid });
    await mongoose.model('HRAnswer').deleteMany({ userId: uid });
    await mongoose.model('ApplicationStatus').deleteMany({ userId: uid });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
