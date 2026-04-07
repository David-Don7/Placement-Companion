const mongoose = require('mongoose');

/**
 * UserActivity Model
 * Tracks all user activities for the recommendation engine
 * Records questions attempted, time spent, performance, etc.
 */
const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Activity type
  activityType: {
    type: String,
    required: true,
    enum: [
      'quiz-attempt',
      'quiz-complete',
      'dsa-view',
      'dsa-attempt',
      'dsa-solved',
      'hr-practice',
      'survey-start',
      'survey-complete',
      'recommendation-click',
      'recommendation-ignore',
      'solution-view',
      'video-watch',
      'code-run',
      'code-submit'
    ]
  },
  
  // Reference to related entity
  entityType: {
    type: String,
    enum: ['question', 'quiz', 'survey', 'solution', 'video', 'recommendation']
  },
  
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // Activity-specific data
  data: {
    // For quiz/question activities
    topic: String,
    difficulty: String,
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    timeTaken: Number,        // seconds
    isCorrect: Boolean,
    
    // For recommendation activities
    recommendationType: String,  // 'quiz', 'question', 'topic'
    recommendedItemId: mongoose.Schema.Types.ObjectId,
    wasActedOn: Boolean,
    
    // For video activities
    videoId: String,
    watchDuration: Number,    // seconds watched
    
    // For code activities
    language: String,
    verdict: String
  },
  
  // Session tracking
  sessionId: {
    type: String,
    default: ''
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ userId: 1, activityType: 1, timestamp: -1 });
userActivitySchema.index({ userId: 1, 'data.topic': 1, timestamp: -1 });
userActivitySchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
