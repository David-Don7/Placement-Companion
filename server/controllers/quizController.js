const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');

// @desc    Get questions for a topic
// @route   GET /api/quiz/questions/:topic
exports.getQuestions = async (req, res) => {
  try {
    const { topic } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const questions = await Question.find({ type: 'aptitude', topic })
      .select('-answer -solution')
      .limit(limit);

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this topic' });
    }

    // Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5);

    res.json({ success: true, data: shuffled, total: shuffled.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { topic, answers, timeTaken } = req.body;
    // answers: [{ questionId, selected }]

    if (!topic || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Topic and answers are required' });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const questionMap = {};
    questions.forEach(q => { questionMap[q._id.toString()] = q; });

    let score = 0;
    const detailedAnswers = answers.map(a => {
      const question = questionMap[a.questionId];
      const correct = question ? String(question.answer) === String(a.selected) : false;
      if (correct) score++;
      return {
        questionId: a.questionId,
        selected: a.selected,
        correct
      };
    });

    const total = answers.length;
    const percentage = Math.round((score / total) * 100);

    const result = await QuizResult.create({
      userId: req.user._id,
      topic,
      score,
      total,
      percentage,
      timeTaken: timeTaken || 0,
      answers: detailedAnswers
    });

    // Get the full questions for detailed results
    const detailedResults = answers.map(a => {
      const question = questionMap[a.questionId];
      return {
        questionId: a.questionId,
        question: question ? question.question : '',
        options: question ? question.options : [],
        selected: a.selected,
        answer: question ? question.answer : -1,
        correct: question ? String(question.answer) === String(a.selected) : false,
        solution: question ? question.solution : ''
      };
    });

    // Determine weak areas
    const topicWeak = {};
    detailedResults.forEach(r => {
      if (!r.correct) {
        const q = questionMap[r.questionId];
        if (q) {
          topicWeak[q.topic] = (topicWeak[q.topic] || 0) + 1;
        }
      }
    });

    res.json({
      success: true,
      data: {
        resultId: result._id,
        score,
        total,
        percentage,
        timeTaken: timeTaken || 0,
        results: detailedResults,
        weakAreas: Object.keys(topicWeak).sort((a, b) => topicWeak[b] - topicWeak[a])
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get quiz history
// @route   GET /api/quiz/history
exports.getQuizHistory = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(20);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get quiz stats
// @route   GET /api/quiz/stats
exports.getQuizStats = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id });

    const totalQuizzes = results.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
      : 0;

    // Per-topic stats
    const topicStats = {};
    results.forEach(r => {
      if (!topicStats[r.topic]) {
        topicStats[r.topic] = { quizzes: 0, totalPercentage: 0 };
      }
      topicStats[r.topic].quizzes++;
      topicStats[r.topic].totalPercentage += r.percentage;
    });

    Object.keys(topicStats).forEach(t => {
      topicStats[t].avgScore = Math.round(topicStats[t].totalPercentage / topicStats[t].quizzes);
    });

    res.json({
      success: true,
      data: { totalQuizzes, avgScore, topicStats }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
