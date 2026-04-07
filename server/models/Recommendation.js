const mongoose = require('mongoose');

/**
 * Recommendation Model
 * Stores generated recommendations for users
 * Cached recommendations with freshness tracking
 */
const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Recommendation type
  type: {
    type: String,
    required: true,
    enum: ['quiz', 'dsa-problem', 'topic', 'learning-path', 'review']
  },
  
  // Reference to recommended entity
  entityType: {
    type: String,
    enum: ['question', 'quiz-topic', 'topic', 'learning-module']
  },
  
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // Recommendation context
  context: {
    // Why was this recommended
    reason: String,  // e.g., "weak-topic", "next-level", "similar-problem", "review-needed"
    
    // Related topic
    topic: String,
    
    // Recommended difficulty
    difficulty: String,
    
    // Confidence score (0-1)
    confidence: { type: Number, default: 0.5 },
    
    // Priority order
    priority: { type: Number, default: 0 },
    
    // Based on which activity
    basedOnActivity: { type: mongoose.Schema.Types.ObjectId, ref: 'UserActivity' }
  },
  
  // Display data (cached for quick rendering)
  display: {
    title: String,
    description: String,
    icon: String,
    color: String,
    actionUrl: String,
    actionText: String
  },
  
  // User interaction tracking
  status: {
    type: String,
    enum: ['pending', 'viewed', 'clicked', 'completed', 'dismissed', 'expired'],
    default: 'pending'
  },
  
  // Timestamps for tracking
  generatedAt: { type: Date, default: Date.now },
  viewedAt: Date,
  clickedAt: Date,
  completedAt: Date,
  dismissedAt: Date,
  
  // Expiration (recommendations can become stale)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 days
  },
  
  // Is this recommendation still valid
  isActive: {
    type: Boolean,
    default: true
  }
});

// Indexes
recommendationSchema.index({ userId: 1, isActive: 1, 'context.priority': -1 });
recommendationSchema.index({ userId: 1, type: 1, isActive: 1 });
recommendationSchema.index({ userId: 1, status: 1 });
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Recommendation', recommendationSchema);
