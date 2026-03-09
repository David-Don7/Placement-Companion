const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['aptitude', 'dsa', 'hr']
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: []            // empty for DSA / HR
  },
  answer: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  // HR-specific fields
  tips: {
    type: [String],
    default: []
  },
  keywords: {
    type: [String],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

questionSchema.index({ type: 1, topic: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
