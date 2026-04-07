/**
 * Solution Routes
 * API routes for text and video solutions
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const solutionController = require('../controllers/solutionController');

// ==========================================
// PUBLIC ROUTES (authenticated users)
// ==========================================

// Get complete solution for a question (text + video)
router.get('/:questionId', auth, solutionController.getSolution);

// Get code solution for a specific language
router.get('/:questionId/code/:language', auth, solutionController.getCodeSolution);

// Get all available code solutions
router.get('/:questionId/code', auth, solutionController.getAllCodeSolutions);

// Get video solution
router.get('/:questionId/video', auth, solutionController.getVideoSolution);

// Get related problems
router.get('/:questionId/related', auth, solutionController.getRelatedProblems);

// ==========================================
// ADMIN ROUTES (for content management)
// ==========================================

// Create or update text solution
router.post('/:questionId', auth, solutionController.upsertSolution);

// Create or update video solution
router.post('/:questionId/video', auth, solutionController.upsertVideoSolution);

module.exports = router;
