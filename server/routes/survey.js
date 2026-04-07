const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  startSurvey,
  submitTier,
  resetSurvey,
  getTopics
} = require('../controllers/surveyController');

// All routes require authentication
router.get('/profile', protect, getProfile);
router.post('/start', protect, startSurvey);
router.post('/submit-tier', protect, submitTier);
router.post('/reset', protect, resetSurvey);
router.get('/topics', protect, getTopics);

module.exports = router;
