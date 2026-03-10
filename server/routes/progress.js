const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  getActivity,
  getChartData
} = require('../controllers/progressController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/activity', protect, getActivity);
router.get('/chart', protect, getChartData);

module.exports = router;
