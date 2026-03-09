const mongoose = require('mongoose');

const hrAnswerSchema = new mongoose.Schema({
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
  userAnswer: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    default: 0
  },
  date: { type: Date, default: Date.now }
});

hrAnswerSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('HRAnswer', hrAnswerSchema);
