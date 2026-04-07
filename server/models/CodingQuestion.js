const mongoose = require('mongoose');

const codingQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: {
    type: String,
    required: true,
    enum: [
      'Arrays',
      'Strings',
      'Recursion',
      'Sorting',
      'Searching',
      'Linked List',
      'Stack',
      'Queue',
      'Trees',
      'Graphs',
      'Dynamic Programming',
      'Greedy',
      'Bit Manipulation',
      'Math'
    ]
  },
  
  // Problem details
  constraints: {
    type: [String],
    default: []
  },
  
  // Example test cases
  examples: [{
    input: String,
    output: String,
    explanation: { type: String, default: '' }
  }],
  
  // Hidden test cases (for validation)
  testCases: [{
    input: String,
    expectedOutput: String,
    hidden: { type: Boolean, default: true }
  }],
  
  // Accepted languages
  supportedLanguages: {
    type: [String],
    enum: ['C', 'C++', 'Java'],
    default: ['C', 'C++', 'Java']
  },
  
  // Solution stats
  acceptanceRate: { type: Number, default: 0 },
  submissionCount: { type: Number, default: 0 },
  acceptedCount: { type: Number, default: 0 },
  
  // Boilerplate code templates
  boilerplate: {
    c: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  
  // Hints and editorial
  hints: { type: [String], default: [] },
  editorial: { type: String, default: '' },
  
  createdAt: { type: Date, default: Date.now }
});

codingQuestionSchema.index({ difficulty: 1, topic: 1 });
codingQuestionSchema.index({ topic: 1 });

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);
