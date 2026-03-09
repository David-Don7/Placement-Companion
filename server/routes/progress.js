const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  getActivity
} = require('../controllers/progressController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/activity', protect, getActivity);

module.exports = router;
