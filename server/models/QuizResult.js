const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,        // seconds
    default: 0
  },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selected: String,
    correct: Boolean
  }],
  date: { type: Date, default: Date.now }
});

quizResultSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
