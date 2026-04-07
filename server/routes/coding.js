const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getQuestions,
  getQuestion,
  submitCode,
  getSubmissions,
  getSubmission,
  getUserStats
} = require('../controllers/codingController');

// All routes require authentication
router.get('/questions', protect, getQuestions);
router.get('/question/:id', protect, getQuestion);
router.post('/submit', protect, submitCode);
router.get('/submissions/:questionId', protect, getSubmissions);
router.get('/submission/:submissionId', protect, getSubmission);
router.get('/stats', protect, getUserStats);

module.exports = router;
