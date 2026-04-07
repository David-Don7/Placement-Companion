const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProblem,
  runCode,
  submitCode,
  getSubmissions,
  getSubmissionDetail,
  getLanguages,
  getStats
} = require('../controllers/codeController');

// All routes require authentication
router.get('/problem/:questionId', protect, getProblem);
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.get('/submissions/:questionId', protect, getSubmissions);
router.get('/submission/:submissionId', protect, getSubmissionDetail);
router.get('/languages', protect, getLanguages);
router.get('/stats', protect, getStats);

module.exports = router;
