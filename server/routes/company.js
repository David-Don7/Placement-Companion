const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCompanies,
  getCompany,
  updateStatus,
  getApplications
} = require('../controllers/companyController');

router.get('/', protect, getCompanies);
router.get('/applications', protect, getApplications);
router.get('/:id', protect, getCompany);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
