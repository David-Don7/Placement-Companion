const SurveyQuestion = require('../models/SurveyQuestion');
const KnowledgeProfile = require('../models/KnowledgeProfile');
const UserActivity = require('../models/UserActivity');

/**
 * Survey Controller
 * Handles adaptive knowledge assessment survey logic
 */

// Tier order and progression rules
const TIERS = ['beginner', 'intermediate', 'advanced', 'expert'];
const QUESTIONS_PER_TIER = 6;
const SKIP_THRESHOLD = 80;    // >= 80% correct = skip next tier
const CONTINUE_THRESHOLD = 50; // 50-79% = continue to next tier
// < 50% = stop survey

/**
 * @desc    Get user's knowledge profile
 * @route   GET /api/survey/profile
 */
exports.getProfile = async (req, res) => {
  try {
    let profile = await KnowledgeProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = await KnowledgeProfile.create({
        userId: req.user._id,
        overallLevel: 'not-assessed'
      });
    }
    
    res.json({
      success: true,
      data: {
        overallLevel: profile.overallLevel,
        topicLevels: Object.fromEntries(profile.topicLevels || new Map()),
        recommendedPath: profile.recommendedPath,
        lastSurveyDate: profile.lastSurveyDate,
        canRetake: profile.canRetakeSurvey(),
        nextEligibleRetake: profile.nextEligibleRetake,
        surveyAttempts: profile.surveyAttempts ? profile.surveyAttempts.length : 0
      }
    });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Start a new survey attempt
 * @route   POST /api/survey/start
 */
exports.startSurvey = async (req, res) => {
  try {
    let profile = await KnowledgeProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await KnowledgeProfile.create({
        userId: req.user._id,
        overallLevel: 'not-assessed'
      });
    }
    
    // Check retake eligibility
    if (!profile.canRetakeSurvey()) {
      return res.status(400).json({
        success: false,
        message: 'Survey can be retaken after 7 days or via manual reset',
        nextEligibleRetake: profile.nextEligibleRetake
      });
    }
    
    // Create new attempt
    const attemptNumber = (profile.surveyAttempts ? profile.surveyAttempts.length : 0) + 1;
    const newAttempt = {
      attemptNumber,
      startedAt: new Date(),
      tiersCompleted: [],
      responses: []
    };
    
    if (!profile.surveyAttempts) {
      profile.surveyAttempts = [];
    }
    profile.surveyAttempts.push(newAttempt);
    profile.resetRequested = false;
    await profile.save();
    
    // Get first tier questions
    const questions = await getQuestionsForTier('beginner');
    
    // Log activity
    await UserActivity.create({
      userId: req.user._id,
      activityType: 'survey-start',
      entityType: 'survey',
      data: { attemptNumber }
    });
    
    res.json({
      success: true,
      data: {
        attemptId: profile.surveyAttempts[profile.surveyAttempts.length - 1]._id,
        currentTier: 'beginner',
        tierIndex: 0,
        totalTiers: TIERS.length,
        questions: questions.map(q => ({
          _id: q._id,
          questionType: q.questionType,
          question: q.question,
          codeSnippet: q.codeSnippet,
          codeLanguage: q.codeLanguage,
          options: q.options,
          topic: q.topic,
          timeLimit: q.timeLimit
        })),
        questionsPerTier: QUESTIONS_PER_TIER
      }
    });
  } catch (err) {
    console.error('startSurvey error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Submit answers for a tier and get next tier or results
 * @route   POST /api/survey/submit-tier
 */
exports.submitTier = async (req, res) => {
  try {
    const { tier, answers, skippedManually } = req.body;
    // answers: [{ questionId, answer, timeTaken }]
    
    if (!tier || !TIERS.includes(tier)) {
      return res.status(400).json({ success: false, message: 'Invalid tier' });
    }
    
    const profile = await KnowledgeProfile.findOne({ userId: req.user._id });
    if (!profile || !profile.surveyAttempts || profile.surveyAttempts.length === 0) {
      return res.status(400).json({ success: false, message: 'No active survey' });
    }
    
    const currentAttempt = profile.surveyAttempts[profile.surveyAttempts.length - 1];
    
    // If manually skipped, handle differently
    if (skippedManually) {
      currentAttempt.tiersCompleted.push({
        tier,
        score: 0,
        total: 0,
        percentage: 100,
        skipped: true,
        mastered: false
      });
      
      const nextTierIndex = TIERS.indexOf(tier) + 1;
      if (nextTierIndex >= TIERS.length) {
        // Complete survey
        return completeSurvey(req, res, profile, currentAttempt);
      }
      
      // Get next tier questions
      const nextTier = TIERS[nextTierIndex];
      const questions = await getQuestionsForTier(nextTier);
      
      await profile.save();
      
      return res.json({
        success: true,
        data: {
          tierResult: { tier, skipped: true },
          nextTier,
          tierIndex: nextTierIndex,
          questions: questions.map(q => ({
            _id: q._id,
            questionType: q.questionType,
            question: q.question,
            codeSnippet: q.codeSnippet,
            codeLanguage: q.codeLanguage,
            options: q.options,
            topic: q.topic,
            timeLimit: q.timeLimit
          }))
        }
      });
    }
    
    // Grade answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await SurveyQuestion.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
    
    let score = 0;
    const topicScores = {};
    
    answers.forEach(a => {
      const question = questionMap.get(a.questionId);
      if (!question) return;
      
      let isCorrect = false;
      
      // Grade based on question type
      switch (question.questionType) {
        case 'multiple-choice':
        case 'true-false':
          isCorrect = String(question.answer) === String(a.answer);
          break;
        case 'fill-blank':
          // Check against keywords
          const userAnswer = String(a.answer).toLowerCase().trim();
          isCorrect = question.answerKeywords.some(kw => 
            userAnswer.includes(kw.toLowerCase())
          ) || userAnswer === String(question.answer).toLowerCase();
          break;
        case 'code-output':
          isCorrect = String(a.answer).trim() === String(question.answer).trim();
          break;
      }
      
      if (isCorrect) score++;
      
      // Track per-topic
      if (!topicScores[question.topic]) {
        topicScores[question.topic] = { correct: 0, total: 0 };
      }
      topicScores[question.topic].total++;
      if (isCorrect) topicScores[question.topic].correct++;
      
      // Store response
      currentAttempt.responses.push({
        questionId: question._id,
        topic: question.topic,
        tier: question.tier,
        selectedAnswer: a.answer,
        isCorrect,
        timeTaken: a.timeTaken || 0
      });
    });
    
    const total = answers.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    // Store tier result
    const tierResult = {
      tier,
      score,
      total,
      percentage,
      skipped: false,
      mastered: percentage >= SKIP_THRESHOLD
    };
    currentAttempt.tiersCompleted.push(tierResult);
    
    // Update topic levels
    Object.entries(topicScores).forEach(([topic, scores]) => {
      const topicPercentage = Math.round((scores.correct / scores.total) * 100);
      const currentTopicData = profile.topicLevels.get(topic) || {
        level: 'beginner',
        score: 0,
        questionsAttempted: 0,
        questionsCorrect: 0
      };
      
      // Update level based on performance
      let newLevel = currentTopicData.level;
      if (topicPercentage >= SKIP_THRESHOLD) {
        const currentTierIndex = TIERS.indexOf(tier);
        newLevel = TIERS[Math.min(currentTierIndex + 1, TIERS.length - 1)];
      } else if (topicPercentage >= CONTINUE_THRESHOLD) {
        newLevel = tier;
      } else {
        const currentTierIndex = TIERS.indexOf(tier);
        newLevel = TIERS[Math.max(currentTierIndex - 1, 0)];
      }
      
      profile.topicLevels.set(topic, {
        level: newLevel,
        score: topicPercentage,
        questionsAttempted: currentTopicData.questionsAttempted + scores.total,
        questionsCorrect: currentTopicData.questionsCorrect + scores.correct,
        lastAssessed: new Date()
      });
    });
    
    // Determine next action
    const currentTierIndex = TIERS.indexOf(tier);
    let nextAction = 'continue';
    let nextTierIndex = currentTierIndex + 1;
    
    if (percentage < CONTINUE_THRESHOLD) {
      // Stop survey - user's level is current tier
      nextAction = 'stop';
    } else if (percentage >= SKIP_THRESHOLD) {
      // Skip next tier, jump two levels
      nextTierIndex = currentTierIndex + 2;
      if (nextTierIndex >= TIERS.length) {
        nextAction = 'complete';
      } else {
        // Mark skipped tier as mastered
        const skippedTier = TIERS[currentTierIndex + 1];
        currentAttempt.tiersCompleted.push({
          tier: skippedTier,
          score: 0,
          total: 0,
          percentage: 100,
          skipped: false,
          mastered: true
        });
        currentAttempt.tiersSkipped = (currentAttempt.tiersSkipped || 0) + 1;
      }
    } else if (nextTierIndex >= TIERS.length) {
      nextAction = 'complete';
    }
    
    await profile.save();
    
    // Handle actions
    if (nextAction === 'stop' || nextAction === 'complete') {
      return completeSurvey(req, res, profile, currentAttempt, tierResult);
    }
    
    // Get next tier questions
    const nextTier = TIERS[nextTierIndex];
    const nextQuestions = await getQuestionsForTier(nextTier);
    
    res.json({
      success: true,
      data: {
        tierResult: {
          ...tierResult,
          topicScores
        },
        nextAction,
        nextTier,
        tierIndex: nextTierIndex,
        tiersSkipped: currentAttempt.tiersSkipped || 0,
        questions: nextQuestions.map(q => ({
          _id: q._id,
          questionType: q.questionType,
          question: q.question,
          codeSnippet: q.codeSnippet,
          codeLanguage: q.codeLanguage,
          options: q.options,
          topic: q.topic,
          timeLimit: q.timeLimit
        }))
      }
    });
  } catch (err) {
    console.error('submitTier error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Complete the survey and calculate final results
 */
async function completeSurvey(req, res, profile, attempt, lastTierResult = null) {
  try {
    // Calculate overall level
    const tiersCompleted = attempt.tiersCompleted;
    let overallLevel = 'beginner';
    
    // Find the highest tier where user scored >= 50%
    for (let i = tiersCompleted.length - 1; i >= 0; i--) {
      const tr = tiersCompleted[i];
      if (!tr.skipped && tr.percentage >= CONTINUE_THRESHOLD) {
        overallLevel = tr.tier;
        break;
      }
      if (tr.mastered) {
        const tierIndex = TIERS.indexOf(tr.tier);
        if (tierIndex >= 0) {
          overallLevel = TIERS[Math.min(tierIndex + 1, TIERS.length - 1)];
        }
        break;
      }
    }
    
    // Calculate total score
    let totalScore = 0;
    let totalQuestions = 0;
    let totalTime = 0;
    
    attempt.responses.forEach(r => {
      totalQuestions++;
      if (r.isCorrect) totalScore++;
      totalTime += r.timeTaken || 0;
    });
    
    // Update attempt
    attempt.completedAt = new Date();
    attempt.finalLevel = overallLevel;
    attempt.totalScore = totalScore;
    attempt.totalQuestions = totalQuestions;
    attempt.totalTimeTaken = totalTime;
    
    // Update profile
    profile.overallLevel = overallLevel;
    profile.lastSurveyDate = new Date();
    profile.nextEligibleRetake = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Calculate recommended path
    const topicLevelsObj = Object.fromEntries(profile.topicLevels);
    const weakTopics = Object.entries(topicLevelsObj)
      .filter(([_, data]) => data.score < 70)
      .sort((a, b) => a[1].score - b[1].score)
      .map(([topic]) => topic);
    
    const skipTopics = Object.entries(topicLevelsObj)
      .filter(([_, data]) => data.level === 'expert' || data.level === 'mastered')
      .map(([topic]) => topic);
    
    // Estimate completion time based on level
    const hoursPerLevel = { beginner: 100, intermediate: 60, advanced: 30, expert: 10 };
    const estimatedHours = hoursPerLevel[overallLevel] || 80;
    
    profile.recommendedPath = {
      topicPriority: weakTopics,
      startingDifficulty: new Map(
        Object.entries(topicLevelsObj).map(([topic, data]) => [topic, data.level])
      ),
      estimatedCompletionHours: estimatedHours,
      skipTopics
    };
    
    await profile.save();
    
    // Log activity
    await UserActivity.create({
      userId: req.user._id,
      activityType: 'survey-complete',
      entityType: 'survey',
      data: {
        finalLevel: overallLevel,
        totalScore,
        totalQuestions,
        percentage: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0,
        tiersSkipped: attempt.tiersSkipped || 0
      }
    });
    
    res.json({
      success: true,
      data: {
        completed: true,
        profile: {
          overallLevel,
          topicLevels: topicLevelsObj,
          totalScore,
          totalQuestions,
          percentage: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0,
          tiersSkipped: attempt.tiersSkipped || 0,
          estimatedCompletionHours: estimatedHours,
          weakTopics,
          skipTopics
        },
        lastTierResult
      }
    });
  } catch (err) {
    console.error('completeSurvey error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * @desc    Request manual survey reset
 * @route   POST /api/survey/reset
 */
exports.resetSurvey = async (req, res) => {
  try {
    const profile = await KnowledgeProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    profile.resetRequested = true;
    profile.overallLevel = 'not-assessed';
    profile.topicLevels = new Map();
    profile.recommendedPath = null;
    await profile.save();
    
    res.json({
      success: true,
      message: 'Survey reset. You can now retake the assessment.'
    });
  } catch (err) {
    console.error('resetSurvey error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get available topics for survey
 * @route   GET /api/survey/topics
 */
exports.getTopics = async (req, res) => {
  try {
    const topics = await SurveyQuestion.distinct('topic', { active: true });
    
    // Get question counts per topic per tier
    const topicStats = {};
    for (const topic of topics) {
      topicStats[topic] = {};
      for (const tier of TIERS) {
        const count = await SurveyQuestion.countDocuments({ topic, tier, active: true });
        topicStats[topic][tier] = count;
      }
    }
    
    res.json({
      success: true,
      data: {
        topics,
        tiers: TIERS,
        questionsPerTier: QUESTIONS_PER_TIER,
        topicStats
      }
    });
  } catch (err) {
    console.error('getTopics error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Helper: Get questions for a tier (samples from all topics)
 */
async function getQuestionsForTier(tier) {
  // Get all active topics
  const topics = await SurveyQuestion.distinct('topic', { tier, active: true });
  
  if (topics.length === 0) {
    return [];
  }
  
  // Calculate how many questions per topic
  const questionsPerTopic = Math.ceil(QUESTIONS_PER_TIER / topics.length);
  
  let allQuestions = [];
  
  for (const topic of topics) {
    const questions = await SurveyQuestion.aggregate([
      { $match: { topic, tier, active: true } },
      { $sample: { size: questionsPerTopic } }
    ]);
    allQuestions = allQuestions.concat(questions);
  }
  
  // Shuffle and limit to QUESTIONS_PER_TIER
  allQuestions = allQuestions.sort(() => Math.random() - 0.5);
  return allQuestions.slice(0, QUESTIONS_PER_TIER);
}
