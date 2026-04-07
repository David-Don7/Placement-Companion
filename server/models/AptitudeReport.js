const mongoose = require('mongoose');

const aptitudeReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Overall metrics
  totalQuestions: { type: Number, required: true },
  attemptedQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  skippedQuestions: { type: Number, required: true },
  score: { type: Number, required: true }, // Total marks
  percentage: { type: Number, required: true },
  totalTimeSeconds: { type: Number, default: 0 },
  averageTimePerQuestion: { type: Number, default: 0 },
  
  // Category-wise breakdown
  categoryAnalysis: [{
    category: String,
    questionsAttempted: Number,
    correctAnswers: Number,
    wrongAnswers: Number,
    accuracy: Number, // percentage
    timeSpent: Number // seconds
  }],
  
  // Performance classification
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Amateur', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  skillLevelExplanation: String,
  
  // Strengths and weaknesses
  strengths: [{
    category: String,
    accuracy: Number,
    level: { type: String, enum: ['Strong', 'Average', 'Weak'] }
  }],
  
  weaknesses: [{
    category: String,
    accuracy: Number,
    level: { type: String, enum: ['Strong', 'Average', 'Weak'] }
  }],
  
  // Speed vs Accuracy
  speedAccuracyInsight: {
    type: String,
    enum: ['Fast and Accurate', 'Fast but Error-prone', 'Slow but Accurate', 'Slow and Needs Practice'],
    default: 'Slow and Needs Practice'
  },
  
  // Recommendations
  recommendations: [String],
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

aptitudeReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AptitudeReport', aptitudeReportSchema);
