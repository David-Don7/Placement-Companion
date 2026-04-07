const mongoose = require('mongoose');

/**
 * CodeTemplate Model
 * Starter code templates for DSA problems in each language
 */
const codeTemplateSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  
  // Templates for each language
  templates: {
    python: {
      code: { type: String, default: '' },
      // Function signature for validation
      functionName: { type: String, default: '' },
      // Import statements
      imports: { type: String, default: '' }
    },
    javascript: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      imports: { type: String, default: '' }
    },
    typescript: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      imports: { type: String, default: '' }
    },
    java: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      className: { type: String, default: 'Solution' },
      imports: { type: String, default: '' }
    },
    cpp: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      includes: { type: String, default: '' }
    },
    c: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      includes: { type: String, default: '' }
    },
    go: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      imports: { type: String, default: '' }
    },
    rust: {
      code: { type: String, default: '' },
      functionName: { type: String, default: '' },
      uses: { type: String, default: '' }
    }
  },
  
  // Input/output format description
  inputFormat: {
    type: String,
    default: ''
  },
  
  outputFormat: {
    type: String,
    default: ''
  },
  
  // Constraints
  constraints: [{
    description: String,
    value: String
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index
codeTemplateSchema.index({ questionId: 1 });

module.exports = mongoose.model('CodeTemplate', codeTemplateSchema);
