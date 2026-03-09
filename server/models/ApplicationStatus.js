const mongoose = require('mongoose');

const applicationStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['not-applied', 'applied', 'interviewed', 'selected', 'rejected'],
    default: 'not-applied'
  },
  updatedAt: { type: Date, default: Date.now }
});

applicationStatusSchema.index({ userId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('ApplicationStatus', applicationStatusSchema);
