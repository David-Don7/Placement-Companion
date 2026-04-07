const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getQuestions, 
  submitAssessment, 
  getReport,
  getLatestReport
} = require('../controllers/aptitudeController');

// All routes require authentication
router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitAssessment);
router.get('/report', protect, getLatestReport);
router.get('/report/:reportId', protect, getReport);

module.exports = router;
