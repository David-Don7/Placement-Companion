const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getQuestions,
  submitQuiz,
  getQuizHistory,
  getQuizStats
} = require('../controllers/quizController');

router.get('/questions/:topic', protect, getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/stats', protect, getQuizStats);

module.exports = router;
