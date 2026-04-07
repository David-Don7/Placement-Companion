const User = require('../models/User');
const AptitudeReport = require('../models/AptitudeReport');
const RecommendationEngine = require('../services/recommendationEngine');
const questions = require('../data/aptitudeAssessment');

// @desc    Get aptitude assessment questions (without correct answers)
// @route   GET /api/aptitude/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    // Block users who already completed the test
    if (req.user.aptitude_test_completed) {
      return res.status(400).json({
        success: false,
        message: 'Aptitude assessment already completed'
      });
    }

    // Return questions without correctAnswer field
    const sanitized = questions.map(q => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options
    }));

    res.json({ success: true, data: sanitized, total: sanitized.length });
  } catch (err) {
    console.error('Aptitude getQuestions error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit aptitude assessment answers and classify user
// @route   POST /api/aptitude/submit
// @access  Private
exports.submitAssessment = async (req, res) => {
  try {
    // Prevent re-submission
    if (req.user.aptitude_test_completed) {
      return res.status(400).json({
        success: false,
        message: 'Aptitude assessment already completed'
      });
    }

    const { answers, timeTaken } = req.body;
    // answers: [{ id: number, selected: number }]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required'
      });
    }

    // Build a lookup map for quick access
    const questionMap = {};
    questions.forEach(q => { questionMap[q.id] = q; });

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const totalQuestions = questions.length;
    const categoryStats = {};
    const categoryTimeSpent = {};

    // Initialize category stats
    questions.forEach(q => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, attempted: 0, wrong: 0, skipped: 0 };
        categoryTimeSpent[q.category] = 0;
      }
    });

    // Score each answer
    answers.forEach(a => {
      const q = questionMap[a.id];
      if (!q) return;

      if (a.selected === null || a.selected === undefined || a.selected === '') {
        skippedCount++;
        categoryStats[q.category].skipped++;
      } else if (typeof a.selected === 'number' && a.selected === q.correctAnswer) {
        correctCount++;
        categoryStats[q.category].correct++;
        categoryStats[q.category].attempted++;
      } else {
        wrongCount++;
        categoryStats[q.category].wrong++;
        categoryStats[q.category].attempted++;
      }
    });

    const attemptedQuestions = correctCount + wrongCount;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const totalTimeSeconds = timeTaken || 0;
    const avgTimePerQuestion = attemptedQuestions > 0 ? totalTimeSeconds / attemptedQuestions : 0;

    // Build category analysis
    const categoryAnalysis = Object.keys(categoryStats).map(cat => {
      const stats = categoryStats[cat];
      const catAccuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
      return {
        category: cat,
        questionsAttempted: stats.attempted,
        correctAnswers: stats.correct,
        wrongAnswers: stats.wrong,
        accuracy: catAccuracy,
        timeSpent: categoryTimeSpent[cat] || 0
      };
    });

    // Generate recommendations and insights
    const { strengths, weaknesses } = RecommendationEngine.analyzeStrengthsWeaknesses(categoryAnalysis);
    const recommendations = RecommendationEngine.generateRecommendations(categoryAnalysis, {
      percentage,
      attemptedQuestions,
      skippedQuestions: skippedCount,
      totalTimeSeconds,
      totalQuestions
    });
    const { level, explanation } = RecommendationEngine.classifySkillLevel(percentage, categoryAnalysis, avgTimePerQuestion);
    const speedAccuracyInsight = RecommendationEngine.getSpeedAccuracyInsight(percentage, avgTimePerQuestion);

    // Create detailed report
    const report = await AptitudeReport.create({
      userId: req.user._id,
      totalQuestions,
      attemptedQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedQuestions: skippedCount,
      score: correctCount,
      percentage,
      totalTimeSeconds,
      averageTimePerQuestion: avgTimePerQuestion,
      categoryAnalysis,
      skillLevel: level,
      skillLevelExplanation: explanation,
      strengths,
      weaknesses,
      speedAccuracyInsight,
      recommendations
    });

    // Update user record
    const user = await User.findById(req.user._id);
    user.aptitude_test_completed = true;
    user.aptitude_score = percentage;
    user.aptitude_level = level;
    await user.save();

    // Return report along with basic data
    res.json({
      success: true,
      data: {
        reportId: report._id,
        score: correctCount,
        total: totalQuestions,
        percentage,
        level,
        breakdown: categoryAnalysis,
        report: {
          attemptedQuestions,
          wrongAnswers: wrongCount,
          skippedQuestions: skippedCount,
          averageTimePerQuestion: avgTimePerQuestion.toFixed(2),
          speedAccuracyInsight,
          strengths: strengths.map(s => s.category),
          weaknesses: weaknesses.map(w => w.category),
          recommendations,
          skillLevelExplanation: explanation
        }
      }
    });
  } catch (err) {
    console.error('Aptitude submit error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get detailed aptitude report
// @route   GET /api/aptitude/report/:reportId
// @access  Private
exports.getReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await AptitudeReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Verify ownership
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Aptitude getReport error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get latest user report
// @route   GET /api/aptitude/report
// @access  Private
exports.getLatestReport = async (req, res) => {
  try {
    const report = await AptitudeReport.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No report found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Aptitude getLatestReport error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
