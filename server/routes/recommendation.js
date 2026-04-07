/**
 * Recommendation Routes
 * API routes for personalized recommendations
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

// Get all recommendations
router.get('/', auth, recommendationController.getRecommendations);

// Get dashboard recommendations (quick snapshot)
router.get('/dashboard', auth, recommendationController.getDashboardRecommendations);

// Get problem recommendations
router.get('/problems', auth, recommendationController.getProblemRecommendations);

// Get quiz recommendations
router.get('/quizzes', auth, recommendationController.getQuizRecommendations);

// Get personalized learning path
router.get('/learning-path', auth, recommendationController.getLearningPath);

// Record interaction with recommendation
router.post('/:id/interact', auth, recommendationController.recordInteraction);

// Force refresh recommendations
router.post('/refresh', auth, recommendationController.refreshRecommendations);

module.exports = router;
