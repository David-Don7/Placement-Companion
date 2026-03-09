const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProblems,
  getProblem,
  toggleSolved,
  getDSAStats
} = require('../controllers/dsaController');

router.get('/problems', protect, getProblems);
router.get('/problems/:id', protect, getProblem);
router.post('/problems/:id/toggle', protect, toggleSolved);
router.get('/stats', protect, getDSAStats);

module.exports = router;
