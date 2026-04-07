const mongoose = require('mongoose');

/**
 * Solution Model
 * Detailed solutions for questions (DSA, aptitude, survey)
 * Includes code solutions in multiple languages
 */
const solutionSchema = new mongoose.Schema({
  // Reference to the question this solution is for
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    unique: true
  },
  
  // ---- Text Solution Parts ----
  
  // Intuition / Approach (plain English explanation)
  intuition: {
    type: String,
    default: ''
  },
  
  // Step-by-step algorithm walkthrough
  algorithmWalkthrough: {
    type: String,
    default: ''
  },
  
  // Complexity analysis
  complexity: {
    time: { type: String, default: '' },      // e.g., "O(n log n)"
    space: { type: String, default: '' },     // e.g., "O(n)"
    timeExplanation: { type: String, default: '' },
    spaceExplanation: { type: String, default: '' }
  },
  
  // Edge cases the solution handles
  edgeCases: [{
    case: String,
    handling: String
  }],
  
  // Common mistakes to avoid
  commonMistakes: [{
    mistake: String,
    explanation: String
  }],
  
  // ---- Code Solutions in Multiple Languages ----
  codeSolutions: {
    python: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    javascript: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    typescript: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    java: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    cpp: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    c: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    go: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    },
    rust: {
      code: { type: String, default: '' },
      explanation: { type: String, default: '' }
    }
  },
  
  // ---- For MCQ/Conceptual Questions ----
  
  // Explanation of why the correct answer is correct
  correctAnswerExplanation: {
    type: String,
    default: ''
  },
  
  // Explanations of why each wrong option is wrong
  wrongOptionsExplanations: [{
    option: String,           // The wrong option text or index
    explanation: String       // Why it's wrong
  }],
  
  // ---- Additional Resources ----
  
  // Related problems/concepts
  relatedProblems: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    title: String,
    relationship: String  // e.g., "similar", "prerequisite", "follow-up"
  }],
  
  // External links for further reading
  externalLinks: [{
    title: String,
    url: String,
    type: String  // e.g., "article", "video", "documentation"
  }],
  
  // ---- Metadata ----
  
  // Is this solution complete/verified
  isComplete: {
    type: Boolean,
    default: false
  },
  
  // Solution difficulty rating (how hard to understand)
  difficultyToUnderstand: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Tags for categorization
  tags: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware
solutionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for querying
solutionSchema.index({ questionId: 1 });
solutionSchema.index({ isComplete: 1 });

module.exports = mongoose.model('Solution', solutionSchema);
