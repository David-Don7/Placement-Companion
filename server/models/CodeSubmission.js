const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingQuestion',
    required: true
  },
  
  // Submission details
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['C', 'C++', 'Java'],
    required: true
  },
  
  // Execution result
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Wrong Answer', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded', 'Memory Limit Exceeded'],
    default: 'Pending'
  },
  
  // Test case results
  testResults: [{
    testCaseIndex: Number,
    passed: Boolean,
    expected: String,
    actual: String,
    error: { type: String, default: '' }
  }],
  
  // Performance metrics
  executionTime: { type: Number, default: 0 }, // ms
  memoryUsed: { type: Number, default: 0 }, // KB
  compilerOutput: { type: String, default: '' },
  runtimeError: { type: String, default: '' },
  
  // Meta
  attempt: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

codeSubmissionSchema.index({ userId: 1, questionId: 1, createdAt: -1 });
codeSubmissionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
