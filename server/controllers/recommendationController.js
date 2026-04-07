/**
 * Recommendation Controller
 * Generates and manages personalized recommendations based on user profile and activity
 */

const Recommendation = require('../models/Recommendation');
const UserActivity = require('../models/UserActivity');
const KnowledgeProfile = require('../models/KnowledgeProfile');
const Question = require('../models/Question');
const DSAProgress = require('../models/DSAProgress');
const QuizResult = require('../models/QuizResult');

// Topic icons and colors for display
const TOPIC_DISPLAY = {
  'Arrays': { icon: 'fa-layer-group', color: '#8b5cf6' },
  'Strings': { icon: 'fa-font', color: '#06b6d4' },
  'Linked List': { icon: 'fa-link', color: '#10b981' },
  'Stack': { icon: 'fa-layer-group', color: '#f59e0b' },
  'Queue': { icon: 'fa-list', color: '#ef4444' },
  'Trees': { icon: 'fa-sitemap', color: '#3b82f6' },
  'Graphs': { icon: 'fa-diagram-project', color: '#a855f7' },
  'Dynamic Programming': { icon: 'fa-table-cells', color: '#f97316' },
  'Quantitative': { icon: 'fa-calculator', color: '#8b5cf6' },
  'Logical Reasoning': { icon: 'fa-brain', color: '#06b6d4' },
  'Verbal Ability': { icon: 'fa-book', color: '#10b981' }
};

/**
 * Get recommendations for current user
 * GET /api/recommendations
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, type } = req.query;
    
    // Check for existing active recommendations
    let recommendations = await Recommendation.find({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .sort({ 'context.priority': -1 })
      .limit(parseInt(limit));
    
    // If no or few recommendations, generate new ones
    if (recommendations.length < 5) {
      await generateRecommendations(userId);
      
      recommendations = await Recommendation.find({
        userId,
        isActive: true,
        expiresAt: { $gt: new Date() }
      })
        .sort({ 'context.priority': -1 })
        .limit(parseInt(limit));
    }
    
    // Filter by type if specified
    if (type) {
      recommendations = recommendations.filter(r => r.type === type);
    }
    
    res.json({
      success: true,
      data: recommendations.map(formatRecommendation)
    });
    
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
};

/**
 * Get dashboard recommendations (quick snapshot)
 * GET /api/recommendations/dashboard
 */
exports.getDashboardRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get profile for context
    const profile = await KnowledgeProfile.findOne({ userId });
    
    // Get recent activity
    const recentActivity = await UserActivity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20);
    
    // Get DSA progress
    const dsaProgress = await DSAProgress.find({ userId, solved: true });
    
    // Generate quick recommendations
    const quickRecs = [];
    
    // 1. Continue where you left off
    const lastActivity = recentActivity.find(a => 
      ['dsa-view', 'dsa-attempt', 'quiz-attempt'].includes(a.activityType)
    );
    if (lastActivity && lastActivity.entityId) {
      const question = await Question.findById(lastActivity.entityId);
      if (question) {
        quickRecs.push({
          type: 'continue',
          title: 'Continue Learning',
          description: question.question.substring(0, 60) + '...',
          icon: 'fa-play-circle',
          color: '#8b5cf6',
          actionUrl: question.type === 'dsa' 
            ? `/editor.html?id=${question._id}` 
            : `/aptitude.html?topic=${encodeURIComponent(question.topic)}`,
          actionText: 'Continue',
          priority: 100
        });
      }
    }
    
    // 2. Weak topic recommendation
    if (profile && profile.recommendedPath && profile.recommendedPath.topicPriority.length > 0) {
      const weakTopic = profile.recommendedPath.topicPriority[0];
      const topicInfo = TOPIC_DISPLAY[weakTopic] || { icon: 'fa-book', color: '#8b5cf6' };
      
      quickRecs.push({
        type: 'weak-topic',
        title: `Improve: ${weakTopic}`,
        description: 'Based on your assessment, this topic needs attention',
        icon: topicInfo.icon,
        color: topicInfo.color,
        actionUrl: `/dsa.html?topic=${encodeURIComponent(weakTopic.toLowerCase().replace(/\s+/g, '-'))}`,
        actionText: 'Practice',
        priority: 90
      });
    }
    
    // 3. Next difficulty challenge
    const solvedEasy = dsaProgress.filter(p => p.difficulty === 'easy').length;
    const solvedMedium = dsaProgress.filter(p => p.difficulty === 'medium').length;
    
    if (solvedEasy >= 5 && solvedMedium < 3) {
      quickRecs.push({
        type: 'challenge',
        title: 'Ready for a Challenge?',
        description: 'You\'ve mastered easy problems. Try medium difficulty!',
        icon: 'fa-trophy',
        color: '#f59e0b',
        actionUrl: '/dsa.html',
        actionText: 'Challenge Me',
        priority: 85
      });
    }
    
    // 4. Daily practice streak
    const today = new Date().setHours(0, 0, 0, 0);
    const activityToday = recentActivity.filter(a => 
      new Date(a.timestamp).setHours(0, 0, 0, 0) === today
    ).length;
    
    if (activityToday === 0) {
      quickRecs.push({
        type: 'daily-practice',
        title: 'Daily Practice',
        description: 'Keep your streak alive! Solve at least one problem today.',
        icon: 'fa-fire',
        color: '#ef4444',
        actionUrl: '/dsa.html',
        actionText: 'Start Now',
        priority: 80
      });
    }
    
    // 5. Assessment prompt if not taken
    if (!profile || profile.overallLevel === 'not-assessed') {
      quickRecs.push({
        type: 'assessment',
        title: 'Take Assessment',
        description: 'Get personalized recommendations based on your skill level',
        icon: 'fa-clipboard-question',
        color: '#06b6d4',
        actionUrl: '/survey.html',
        actionText: 'Start Assessment',
        priority: 95
      });
    }
    
    // Sort by priority
    quickRecs.sort((a, b) => b.priority - a.priority);
    
    res.json({
      success: true,
      data: quickRecs.slice(0, 4) // Return top 4 for dashboard
    });
    
  } catch (err) {
    console.error('Dashboard recommendations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard recommendations'
    });
  }
};

/**
 * Get problem recommendations (next problems to solve)
 * GET /api/recommendations/problems
 */
exports.getProblemRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, limit = 5 } = req.query;
    
    // Get user's knowledge profile
    const profile = await KnowledgeProfile.findOne({ userId });
    
    // Get solved problems
    const solvedProblems = await DSAProgress.find({ userId, solved: true })
      .select('questionId');
    const solvedIds = solvedProblems.map(p => p.questionId);
    
    // Build query for recommended problems
    const query = {
      type: 'dsa',
      _id: { $nin: solvedIds }
    };
    
    // Filter by topic if specified
    if (topic) {
      query.topic = topic;
    }
    
    // Determine recommended difficulty based on profile
    let recommendedDifficulty = 'easy';
    if (profile) {
      if (profile.overallLevel === 'advanced' || profile.overallLevel === 'expert') {
        recommendedDifficulty = 'medium';
      } else if (profile.overallLevel === 'intermediate') {
        recommendedDifficulty = 'easy'; // Start with easy, but mix in medium
      }
    }
    
    // Get problems prioritizing recommended difficulty
    const easyProblems = await Question.find({ ...query, difficulty: 'easy' })
      .limit(3)
      .select('question topic difficulty');
    
    const mediumProblems = await Question.find({ ...query, difficulty: 'medium' })
      .limit(3)
      .select('question topic difficulty');
    
    const hardProblems = await Question.find({ ...query, difficulty: 'hard' })
      .limit(2)
      .select('question topic difficulty');
    
    // Mix problems based on level
    let recommendedProblems = [];
    if (profile && (profile.overallLevel === 'advanced' || profile.overallLevel === 'expert')) {
      recommendedProblems = [...mediumProblems, ...hardProblems, ...easyProblems];
    } else if (profile && profile.overallLevel === 'intermediate') {
      recommendedProblems = [...easyProblems, ...mediumProblems, ...hardProblems];
    } else {
      recommendedProblems = [...easyProblems, ...mediumProblems];
    }
    
    // Format response
    const problems = recommendedProblems.slice(0, parseInt(limit)).map(p => ({
      _id: p._id,
      question: p.question,
      topic: p.topic,
      difficulty: p.difficulty,
      reason: getRecommendationReason(p, profile),
      actionUrl: `/editor.html?id=${p._id}`
    }));
    
    res.json({
      success: true,
      data: problems
    });
    
  } catch (err) {
    console.error('Problem recommendations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem recommendations'
    });
  }
};

/**
 * Get quiz recommendations
 * GET /api/recommendations/quizzes
 */
exports.getQuizRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get quiz history
    const quizHistory = await QuizResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Get knowledge profile
    const profile = await KnowledgeProfile.findOne({ userId });
    
    // Analyze weak topics from quiz history
    const topicPerformance = {};
    quizHistory.forEach(quiz => {
      if (!topicPerformance[quiz.topic]) {
        topicPerformance[quiz.topic] = { attempts: 0, totalScore: 0 };
      }
      topicPerformance[quiz.topic].attempts++;
      topicPerformance[quiz.topic].totalScore += quiz.percentage;
    });
    
    // Calculate average scores and find weak topics
    const weakTopics = [];
    for (const [topic, data] of Object.entries(topicPerformance)) {
      const avgScore = data.totalScore / data.attempts;
      if (avgScore < 70) {
        weakTopics.push({ topic, avgScore, attempts: data.attempts });
      }
    }
    weakTopics.sort((a, b) => a.avgScore - b.avgScore);
    
    // Get topics not yet attempted
    const allTopics = ['Quantitative', 'Logical Reasoning', 'Verbal Ability'];
    const attemptedTopics = Object.keys(topicPerformance);
    const newTopics = allTopics.filter(t => !attemptedTopics.includes(t));
    
    // Build recommendations
    const recommendations = [];
    
    // Weak topics first
    weakTopics.slice(0, 2).forEach(wt => {
      const topicInfo = TOPIC_DISPLAY[wt.topic] || { icon: 'fa-book', color: '#8b5cf6' };
      recommendations.push({
        type: 'review',
        title: `Review: ${wt.topic}`,
        description: `Your average score is ${Math.round(wt.avgScore)}%. Practice more to improve!`,
        icon: topicInfo.icon,
        color: topicInfo.color,
        topic: wt.topic,
        difficulty: 'mixed',
        actionUrl: `/aptitude.html?topic=${encodeURIComponent(wt.topic)}`,
        actionText: 'Practice Now',
        priority: 100 - wt.avgScore
      });
    });
    
    // New topics
    newTopics.forEach(topic => {
      const topicInfo = TOPIC_DISPLAY[topic] || { icon: 'fa-book', color: '#8b5cf6' };
      recommendations.push({
        type: 'explore',
        title: `Try: ${topic}`,
        description: 'You haven\'t attempted this topic yet. Give it a try!',
        icon: topicInfo.icon,
        color: topicInfo.color,
        topic: topic,
        difficulty: 'easy',
        actionUrl: `/aptitude.html?topic=${encodeURIComponent(topic)}`,
        actionText: 'Explore',
        priority: 50
      });
    });
    
    recommendations.sort((a, b) => b.priority - a.priority);
    
    res.json({
      success: true,
      data: recommendations.slice(0, 5)
    });
    
  } catch (err) {
    console.error('Quiz recommendations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz recommendations'
    });
  }
};

/**
 * Get learning path based on profile
 * GET /api/recommendations/learning-path
 */
exports.getLearningPath = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get knowledge profile
    const profile = await KnowledgeProfile.findOne({ userId });
    
    if (!profile || profile.overallLevel === 'not-assessed') {
      return res.json({
        success: true,
        data: {
          hasAssessment: false,
          message: 'Complete the knowledge assessment to get a personalized learning path',
          actionUrl: '/survey.html'
        }
      });
    }
    
    // Get DSA progress
    const dsaProgress = await DSAProgress.find({ userId });
    
    // Build learning path
    const topics = ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'Dynamic Programming'];
    const path = [];
    
    for (const topic of topics) {
      const topicLevel = profile.topicLevels?.get(topic);
      const solvedInTopic = dsaProgress.filter(p => p.topic === topic && p.solved).length;
      
      // Get total questions in topic
      const totalInTopic = await Question.countDocuments({ type: 'dsa', topic });
      
      const topicInfo = TOPIC_DISPLAY[topic] || { icon: 'fa-book', color: '#8b5cf6' };
      
      // Determine status
      let status = 'not-started';
      let recommendedDifficulty = 'easy';
      
      if (topicLevel) {
        if (topicLevel.level === 'expert' || topicLevel.level === 'mastered') {
          status = 'mastered';
          recommendedDifficulty = 'hard';
        } else if (topicLevel.level === 'advanced') {
          status = 'advanced';
          recommendedDifficulty = 'medium';
        } else if (topicLevel.level === 'intermediate') {
          status = 'in-progress';
          recommendedDifficulty = 'easy';
        } else if (solvedInTopic > 0) {
          status = 'started';
        }
      } else if (solvedInTopic > 0) {
        status = 'started';
      }
      
      path.push({
        topic,
        icon: topicInfo.icon,
        color: topicInfo.color,
        status,
        level: topicLevel?.level || 'not-assessed',
        progress: {
          solved: solvedInTopic,
          total: totalInTopic,
          percentage: totalInTopic > 0 ? Math.round((solvedInTopic / totalInTopic) * 100) : 0
        },
        recommendedDifficulty,
        isPriority: profile.recommendedPath?.topicPriority?.includes(topic) || false
      });
    }
    
    // Sort: Priority topics first, then by status
    const statusOrder = { 'not-started': 0, 'started': 1, 'in-progress': 2, 'advanced': 3, 'mastered': 4 };
    path.sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return statusOrder[a.status] - statusOrder[b.status];
    });
    
    res.json({
      success: true,
      data: {
        hasAssessment: true,
        overallLevel: profile.overallLevel,
        estimatedHours: profile.recommendedPath?.estimatedCompletionHours || 40,
        path,
        priorityTopics: profile.recommendedPath?.topicPriority || [],
        skipTopics: profile.recommendedPath?.skipTopics || []
      }
    });
    
  } catch (err) {
    console.error('Learning path error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning path'
    });
  }
};

/**
 * Record user interaction with recommendation
 * POST /api/recommendations/:id/interact
 */
exports.recordInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'view', 'click', 'complete', 'dismiss'
    const userId = req.user.id;
    
    const recommendation = await Recommendation.findOne({ _id: id, userId });
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }
    
    // Update recommendation status
    switch (action) {
      case 'view':
        recommendation.status = 'viewed';
        recommendation.viewedAt = new Date();
        break;
      case 'click':
        recommendation.status = 'clicked';
        recommendation.clickedAt = new Date();
        break;
      case 'complete':
        recommendation.status = 'completed';
        recommendation.completedAt = new Date();
        recommendation.isActive = false;
        break;
      case 'dismiss':
        recommendation.status = 'dismissed';
        recommendation.dismissedAt = new Date();
        recommendation.isActive = false;
        break;
    }
    
    await recommendation.save();
    
    // Log activity
    await UserActivity.create({
      userId,
      activityType: action === 'click' ? 'recommendation-click' : 'recommendation-ignore',
      entityType: 'recommendation',
      entityId: id,
      data: {
        recommendationType: recommendation.type
      }
    });
    
    res.json({
      success: true,
      message: 'Interaction recorded'
    });
    
  } catch (err) {
    console.error('Record interaction error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to record interaction'
    });
  }
};

/**
 * Refresh recommendations (force regenerate)
 * POST /api/recommendations/refresh
 */
exports.refreshRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Mark old recommendations as expired
    await Recommendation.updateMany(
      { userId, isActive: true },
      { isActive: false, status: 'expired' }
    );
    
    // Generate new recommendations
    await generateRecommendations(userId);
    
    // Get fresh recommendations
    const recommendations = await Recommendation.find({
      userId,
      isActive: true
    })
      .sort({ 'context.priority': -1 })
      .limit(10);
    
    res.json({
      success: true,
      message: 'Recommendations refreshed',
      data: recommendations.map(formatRecommendation)
    });
    
  } catch (err) {
    console.error('Refresh recommendations error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh recommendations'
    });
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Generate recommendations for a user
 */
async function generateRecommendations(userId) {
  try {
    // Get user data
    const [profile, dsaProgress, quizResults, recentActivity] = await Promise.all([
      KnowledgeProfile.findOne({ userId }),
      DSAProgress.find({ userId }),
      QuizResult.find({ userId }).sort({ createdAt: -1 }).limit(10),
      UserActivity.find({ userId }).sort({ timestamp: -1 }).limit(50)
    ]);
    
    const recommendations = [];
    const solvedIds = dsaProgress.filter(p => p.solved).map(p => p.questionId.toString());
    
    // 1. Weak topic problems
    if (profile && profile.recommendedPath && profile.recommendedPath.topicPriority) {
      for (const topic of profile.recommendedPath.topicPriority.slice(0, 2)) {
        const difficulty = profile.recommendedPath.startingDifficulty?.get(topic) || 'easy';
        const problem = await Question.findOne({
          type: 'dsa',
          topic,
          difficulty,
          _id: { $nin: solvedIds.map(id => require('mongoose').Types.ObjectId(id)) }
        });
        
        if (problem) {
          const topicInfo = TOPIC_DISPLAY[topic] || { icon: 'fa-code', color: '#8b5cf6' };
          recommendations.push({
            userId,
            type: 'dsa-problem',
            entityType: 'question',
            entityId: problem._id,
            context: {
              reason: 'weak-topic',
              topic,
              difficulty,
              confidence: 0.8,
              priority: 90
            },
            display: {
              title: problem.question.substring(0, 50) + (problem.question.length > 50 ? '...' : ''),
              description: `Improve your ${topic} skills`,
              icon: topicInfo.icon,
              color: topicInfo.color,
              actionUrl: `/editor.html?id=${problem._id}`,
              actionText: 'Solve'
            }
          });
        }
      }
    }
    
    // 2. Next level problems
    const easyCount = dsaProgress.filter(p => p.solved && p.difficulty === 'easy').length;
    if (easyCount >= 5) {
      const mediumProblem = await Question.findOne({
        type: 'dsa',
        difficulty: 'medium',
        _id: { $nin: solvedIds.map(id => require('mongoose').Types.ObjectId(id)) }
      });
      
      if (mediumProblem) {
        recommendations.push({
          userId,
          type: 'dsa-problem',
          entityType: 'question',
          entityId: mediumProblem._id,
          context: {
            reason: 'next-level',
            topic: mediumProblem.topic,
            difficulty: 'medium',
            confidence: 0.7,
            priority: 85
          },
          display: {
            title: 'Level Up Challenge',
            description: 'Try a medium difficulty problem',
            icon: 'fa-arrow-up',
            color: '#f59e0b',
            actionUrl: `/editor.html?id=${mediumProblem._id}`,
            actionText: 'Challenge'
          }
        });
      }
    }
    
    // 3. Review recommendations (for topics with declining performance)
    const topicAttempts = {};
    quizResults.forEach(qr => {
      if (!topicAttempts[qr.topic]) topicAttempts[qr.topic] = [];
      topicAttempts[qr.topic].push(qr.percentage);
    });
    
    for (const [topic, scores] of Object.entries(topicAttempts)) {
      if (scores.length >= 2 && scores[0] < scores[scores.length - 1] - 10) {
        const topicInfo = TOPIC_DISPLAY[topic] || { icon: 'fa-book', color: '#8b5cf6' };
        recommendations.push({
          userId,
          type: 'review',
          context: {
            reason: 'review-needed',
            topic,
            confidence: 0.6,
            priority: 70
          },
          display: {
            title: `Review ${topic}`,
            description: 'Your recent scores have dropped. Time for a review!',
            icon: topicInfo.icon,
            color: '#ef4444',
            actionUrl: `/aptitude.html?topic=${encodeURIComponent(topic)}`,
            actionText: 'Review'
          }
        });
      }
    }
    
    // Save recommendations
    if (recommendations.length > 0) {
      await Recommendation.insertMany(recommendations);
    }
    
    return recommendations;
  } catch (err) {
    console.error('Generate recommendations error:', err);
    return [];
  }
}

/**
 * Format recommendation for API response
 */
function formatRecommendation(rec) {
  return {
    id: rec._id,
    type: rec.type,
    title: rec.display.title,
    description: rec.display.description,
    icon: rec.display.icon,
    color: rec.display.color,
    actionUrl: rec.display.actionUrl,
    actionText: rec.display.actionText,
    context: {
      topic: rec.context.topic,
      difficulty: rec.context.difficulty,
      reason: rec.context.reason,
      priority: rec.context.priority
    },
    status: rec.status,
    generatedAt: rec.generatedAt
  };
}

/**
 * Get human-readable reason for recommendation
 */
function getRecommendationReason(problem, profile) {
  if (!profile) {
    return 'Good starting problem';
  }
  
  const topicLevel = profile.topicLevels?.get(problem.topic);
  
  if (!topicLevel || topicLevel.level === 'beginner') {
    if (problem.difficulty === 'easy') {
      return 'Perfect for building foundation';
    }
  }
  
  if (topicLevel?.level === 'intermediate' && problem.difficulty === 'medium') {
    return 'Matches your current level';
  }
  
  if (profile.recommendedPath?.topicPriority?.includes(problem.topic)) {
    return 'Focus area based on assessment';
  }
  
  return 'Recommended for practice';
}
