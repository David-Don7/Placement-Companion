const Question = require('../models/Question');
const HRAnswer = require('../models/HRAnswer');

// @desc    Get a random HR question
// @route   GET /api/hr/random
exports.getRandomQuestion = async (req, res) => {
  try {
    const count = await Question.countDocuments({ type: 'hr' });
    if (count === 0) {
      return res.status(404).json({ success: false, message: 'No HR questions available' });
    }

    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne({ type: 'hr' })
      .skip(random)
      .select('-answer -keywords');

    res.json({ success: true, data: question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit HR answer
// @route   POST /api/hr/submit
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;

    if (!questionId || !userAnswer) {
      return res.status(400).json({ success: false, message: 'Question ID and answer are required' });
    }

    const question = await Question.findById(questionId);
    if (!question || question.type !== 'hr') {
      return res.status(404).json({ success: false, message: 'HR question not found' });
    }

    // Keyword matching
    const answerLower = userAnswer.toLowerCase();
    const keywords = question.keywords || [];
    const matched = keywords.filter(kw => answerLower.includes(kw.toLowerCase()));
    const matchScore = keywords.length > 0
      ? Math.round((matched.length / keywords.length) * 100)
      : 0;

    // Word count check
    const wordCount = userAnswer.trim().split(/\s+/).length;

    // Rating based on match score and length
    let rating = 'Needs Improvement';
    if (matchScore >= 70 && wordCount >= 30) rating = 'Excellent';
    else if (matchScore >= 50 && wordCount >= 20) rating = 'Good';
    else if (matchScore >= 30 || wordCount >= 15) rating = 'Average';

    const answer = await HRAnswer.create({
      userId: req.user._id,
      questionId,
      userAnswer,
      matchScore
    });

    res.json({
      success: true,
      data: {
        answerId: answer._id,
        matchScore,
        matchedKeywords: matched,
        totalKeywords: keywords.length,
        wordCount,
        rating,
        modelAnswer: question.solution,
        tips: question.tips
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get HR answer history
// @route   GET /api/hr/history
exports.getHistory = async (req, res) => {
  try {
    const answers = await HRAnswer.find({ userId: req.user._id })
      .populate('questionId', 'question')
      .sort({ date: -1 })
      .limit(20);

    res.json({ success: true, data: answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get HR stats
// @route   GET /api/hr/stats
exports.getHRStats = async (req, res) => {
  try {
    const answers = await HRAnswer.find({ userId: req.user._id });

    const totalPracticed = answers.length;
    const avgMatchScore = totalPracticed > 0
      ? Math.round(answers.reduce((sum, a) => sum + a.matchScore, 0) / totalPracticed)
      : 0;
    const savedCount = answers.filter(a => a.matchScore >= 70).length;

    res.json({
      success: true,
      data: { totalPracticed, avgMatchScore, savedCount }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
