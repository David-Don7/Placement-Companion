const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getRandomQuestion,
  submitAnswer,
  getHistory,
  getHRStats
} = require('../controllers/hrController');

router.get('/random', protect, getRandomQuestion);
router.post('/submit', protect, submitAnswer);
router.get('/history', protect, getHistory);
router.get('/stats', protect, getHRStats);

module.exports = router;
