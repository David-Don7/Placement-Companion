const mongoose = require('mongoose');

/**
 * KnowledgeProfile Model
 * Stores user's adaptive survey results and skill levels per topic
 */
const knowledgeProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Overall determined level from survey
  overallLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'not-assessed'],
    default: 'not-assessed'
  },
  
  // Per-topic skill levels
  topicLevels: {
    type: Map,
    of: {
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert', 'mastered']
      },
      score: Number,          // Score achieved in that topic
      questionsAttempted: Number,
      questionsCorrect: Number,
      lastAssessed: Date
    },
    default: new Map()
  },
  
  // Survey attempt details
  surveyAttempts: [{
    attemptNumber: { type: Number, default: 1 },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    
    // Track progress through tiers
    tiersCompleted: [{
      tier: String,
      score: Number,
      total: Number,
      percentage: Number,
      skipped: { type: Boolean, default: false },
      mastered: { type: Boolean, default: false }
    }],
    
    // Final result of this attempt
    finalLevel: String,
    totalScore: Number,
    totalQuestions: Number,
    tiersSkipped: { type: Number, default: 0 },
    
    // Time tracking
    totalTimeTaken: Number,  // in seconds
    
    // Per-question responses
    responses: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurveyQuestion' },
      topic: String,
      tier: String,
      selectedAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      timeTaken: Number  // seconds spent on this question
    }]
  }],
  
  // Calculated recommendations based on profile
  recommendedPath: {
    // Topics to focus on (weakest first)
    topicPriority: [String],
    
    // Suggested starting difficulty for each topic
    startingDifficulty: {
      type: Map,
      of: String
    },
    
    // Estimated completion time for curriculum (in hours)
    estimatedCompletionHours: Number,
    
    // Topics that can be skipped (already mastered)
    skipTopics: [String]
  },
  
  // Last survey completion date (for retake policy)
  lastSurveyDate: Date,
  
  // Manual reset requested
  resetRequested: {
    type: Boolean,
    default: false
  },
  
  // Next eligible retake date
  nextEligibleRetake: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
knowledgeProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method: Check if user can retake survey
knowledgeProfileSchema.methods.canRetakeSurvey = function() {
  if (this.resetRequested) return true;
  if (!this.lastSurveyDate) return true;
  
  const daysSinceLastSurvey = Math.floor(
    (Date.now() - this.lastSurveyDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceLastSurvey >= 7;
};

// Instance method: Get level for a specific topic
knowledgeProfileSchema.methods.getTopicLevel = function(topic) {
  const topicData = this.topicLevels.get(topic);
  return topicData ? topicData.level : 'not-assessed';
};

// Instance method: Calculate overall progress percentage
knowledgeProfileSchema.methods.getProgressPercentage = function() {
  const levelWeights = {
    'not-assessed': 0,
    'beginner': 25,
    'intermediate': 50,
    'advanced': 75,
    'expert': 100,
    'mastered': 100
  };
  return levelWeights[this.overallLevel] || 0;
};

// Index for querying
knowledgeProfileSchema.index({ userId: 1 });
knowledgeProfileSchema.index({ overallLevel: 1 });

module.exports = mongoose.model('KnowledgeProfile', knowledgeProfileSchema);
