const mongoose = require('mongoose');

/**
 * SurveyQuestion Model
 * Questions for the Adaptive Knowledge Assessment Survey
 * Organized by difficulty tiers and topic domains
 */
const surveyQuestionSchema = new mongoose.Schema({
  // Question type: multiple-choice, true-false, fill-blank, code-output
  questionType: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'true-false', 'fill-blank', 'code-output']
  },
  
  // Difficulty tier: beginner, intermediate, advanced, expert
  tier: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  
  // Topic domain (matches app's topic structure)
  topic: {
    type: String,
    required: true,
    enum: [
      'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue',
      'Trees', 'Graphs', 'Dynamic Programming', 'Recursion',
      'Sorting', 'Searching', 'Hashing', 'Bit Manipulation',
      'Math', 'Quantitative', 'Logical Reasoning', 'Verbal Ability'
    ]
  },
  
  // The question text
  question: {
    type: String,
    required: true
  },
  
  // Code snippet for code-output type questions
  codeSnippet: {
    type: String,
    default: ''
  },
  
  // Programming language of code snippet
  codeLanguage: {
    type: String,
    enum: ['python', 'javascript', 'java', 'cpp', 'c', ''],
    default: ''
  },
  
  // Options for multiple-choice/true-false questions
  options: {
    type: [String],
    default: []
  },
  
  // Correct answer (index for MCQ, 'true'/'false' for T/F, text for fill-blank)
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Keywords for fill-blank answer validation (client-side matching)
  answerKeywords: {
    type: [String],
    default: []
  },
  
  // Explanation of the correct answer
  explanation: {
    type: String,
    default: ''
  },
  
  // Points awarded for correct answer (can vary by tier)
  points: {
    type: Number,
    default: 1
  },
  
  // Time limit in seconds (optional, for timed questions)
  timeLimit: {
    type: Number,
    default: 60
  },
  
  // Is this question active/enabled
  active: {
    type: Boolean,
    default: true
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient querying by tier and topic
surveyQuestionSchema.index({ tier: 1, topic: 1, active: 1 });
surveyQuestionSchema.index({ tier: 1, questionType: 1 });

module.exports = mongoose.model('SurveyQuestion', surveyQuestionSchema);
