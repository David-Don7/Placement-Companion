const mongoose = require('mongoose');

const dsaProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  solved: {
    type: Boolean,
    default: true
  },
  date: { type: Date, default: Date.now }
});

dsaProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('DSAProgress', dsaProgressSchema);
