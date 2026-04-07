const mongoose = require('mongoose');

/**
 * TestCase Model
 * Test cases for DSA problems
 * Used by the code execution/judging system
 */
const testCaseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  
  // Input for the test case
  input: {
    type: String,
    required: true
  },
  
  // Expected output
  expectedOutput: {
    type: String,
    required: true
  },
  
  // Is this a hidden test case (not shown to users)
  isHidden: {
    type: Boolean,
    default: false
  },
  
  // Is this a sample test case (shown in problem description)
  isSample: {
    type: Boolean,
    default: false
  },
  
  // Test case weight (for partial scoring)
  weight: {
    type: Number,
    default: 1
  },
  
  // Time limit override for this specific test (milliseconds)
  timeLimit: {
    type: Number,
    default: 2000  // 2 seconds default
  },
  
  // Memory limit override (bytes)
  memoryLimit: {
    type: Number,
    default: 256 * 1024 * 1024  // 256MB default
  },
  
  // Order of execution
  order: {
    type: Number,
    default: 0
  },
  
  // Description/explanation of this test case
  description: {
    type: String,
    default: ''
  },
  
  // Is this an edge case?
  isEdgeCase: {
    type: Boolean,
    default: false
  },
  
  // Edge case type (for categorization)
  edgeCaseType: {
    type: String,
    enum: ['', 'empty-input', 'single-element', 'large-input', 'negative', 'boundary', 'special'],
    default: ''
  },
  
  createdAt: { type: Date, default: Date.now }
});

// Indexes
testCaseSchema.index({ questionId: 1, order: 1 });
testCaseSchema.index({ questionId: 1, isSample: 1 });
testCaseSchema.index({ questionId: 1, isHidden: 1 });

module.exports = mongoose.model('TestCase', testCaseSchema);
