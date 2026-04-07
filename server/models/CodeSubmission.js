const mongoose = require('mongoose');

/**
 * CodeSubmission Model
 * Stores user code submissions for DSA problems
 * Tracks execution results, runtime, memory usage
 */
const codeSubmissionSchema = new mongoose.Schema({
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
  
  // Programming language used
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust']
  },
  
  // The submitted code
  code: {
    type: String,
    required: true
  },
  
  // Submission type: 'run' (test) or 'submit' (full evaluation)
  submissionType: {
    type: String,
    enum: ['run', 'submit'],
    default: 'run'
  },
  
  // Overall verdict
  verdict: {
    type: String,
    enum: [
      'accepted',
      'wrong-answer',
      'time-limit-exceeded',
      'memory-limit-exceeded',
      'runtime-error',
      'compilation-error',
      'pending',
      'internal-error'
    ],
    default: 'pending'
  },
  
  // Per-test-case results
  testResults: [{
    testCaseId: String,
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    runtime: Number,        // milliseconds
    memory: Number,         // bytes
    error: String,          // error message if any
    isHidden: Boolean       // whether this was a hidden test case
  }],
  
  // Aggregate metrics
  metrics: {
    totalTestCases: { type: Number, default: 0 },
    passedTestCases: { type: Number, default: 0 },
    runtime: { type: Number, default: 0 },           // avg runtime in ms
    memory: { type: Number, default: 0 },            // peak memory in bytes
    runtimePercentile: { type: Number, default: 0 }, // beats X% of submissions
    memoryPercentile: { type: Number, default: 0 }   // beats X% of submissions
  },
  
  // Execution output
  stdout: {
    type: String,
    default: ''
  },
  
  stderr: {
    type: String,
    default: ''
  },
  
  // Compilation errors (for compiled languages)
  compileError: {
    type: String,
    default: ''
  },
  
  // Judge execution token (for async result retrieval)
  judgeToken: {
    type: String,
    default: ''
  },
  
  // Judge service used
  judgeService: {
    type: String,
    enum: ['judge0', 'piston', 'custom'],
    default: 'judge0'
  },
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  executedAt: Date,
  
  // Execution duration (time to get results)
  executionDuration: {
    type: Number,
    default: 0
  }
});

// Indexes for efficient querying
codeSubmissionSchema.index({ userId: 1, questionId: 1, submittedAt: -1 });
codeSubmissionSchema.index({ userId: 1, verdict: 1 });
codeSubmissionSchema.index({ questionId: 1, verdict: 1 });
codeSubmissionSchema.index({ judgeToken: 1 });

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
