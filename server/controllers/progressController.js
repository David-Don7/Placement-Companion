const QuizResult = require('../models/QuizResult');
const DSAProgress = require('../models/DSAProgress');
const HRAnswer = require('../models/HRAnswer');
const Question = require('../models/Question');
const ApplicationStatus = require('../models/ApplicationStatus');
const Company = require('../models/Company');

// @desc    Get dashboard stats
// @route   GET /api/progress/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Quiz stats
    const quizResults = await QuizResult.find({ userId });
    const totalQuizzes = quizResults.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
      : 0;

    // DSA stats
    const totalDSA = await Question.countDocuments({ type: 'dsa' });
    const dsaSolved = await DSAProgress.countDocuments({ userId, solved: true });

    // HR stats
    const hrPracticed = await HRAnswer.countDocuments({ userId });

    // Streak
    const user = req.user;

    // Topic-wise quiz breakdown
    const topicStats = {};
    quizResults.forEach(r => {
      if (!topicStats[r.topic]) {
        topicStats[r.topic] = { quizzes: 0, totalPerc: 0 };
      }
      topicStats[r.topic].quizzes++;
      topicStats[r.topic].totalPerc += r.percentage;
    });
    Object.keys(topicStats).forEach(t => {
      topicStats[t].avg = Math.round(topicStats[t].totalPerc / topicStats[t].quizzes);
    });

    // DSA topic breakdown
    const solvedProgress = await DSAProgress.find({ userId, solved: true }).select('questionId');
    const solvedIds = solvedProgress.map(s => s.questionId);
    const allDSA = await Question.find({ type: 'dsa' }).select('topic');
    const solvedDSA = await Question.find({ _id: { $in: solvedIds }, type: 'dsa' }).select('topic');

    const dsaTopicTotal = {};
    const dsaTopicSolved = {};
    allDSA.forEach(p => { dsaTopicTotal[p.topic] = (dsaTopicTotal[p.topic] || 0) + 1; });
    solvedDSA.forEach(p => { dsaTopicSolved[p.topic] = (dsaTopicSolved[p.topic] || 0) + 1; });

    const dsaTopicStats = {};
    Object.keys(dsaTopicTotal).forEach(t => {
      dsaTopicStats[t] = {
        total: dsaTopicTotal[t],
        solved: dsaTopicSolved[t] || 0
      };
    });

    // Upcoming companies
    const now = new Date();
    const upcoming = await Company.find({ visitDate: { $gte: now } })
      .sort({ visitDate: 1 })
      .limit(5);

    // Company statuses for upcoming
    const upcomingIds = upcoming.map(c => c._id);
    const statuses = await ApplicationStatus.find({
      userId,
      companyId: { $in: upcomingIds }
    });
    const statusMap = {};
    statuses.forEach(s => { statusMap[s.companyId.toString()] = s.status; });

    const upcomingCompanies = upcoming.map(c => ({
      _id: c._id,
      name: c.name,
      role: c.role,
      visitDate: c.visitDate,
      status: statusMap[c._id.toString()] || 'not-applied'
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalQuizzes,
          avgScore,
          dsaSolved,
          totalDSA,
          hrPracticed,
          streak: user.streak || 0
        },
        topicStats,
        dsaTopicStats,
        upcomingCompanies
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get recent activity
// @route   GET /api/progress/activity
exports.getActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Gather recent activities from different collections
    const [quizzes, dsaEntries, hrEntries] = await Promise.all([
      QuizResult.find({ userId }).sort({ date: -1 }).limit(limit).lean(),
      DSAProgress.find({ userId, solved: true }).sort({ date: -1 }).limit(limit)
        .populate('questionId', 'question topic').lean(),
      HRAnswer.find({ userId }).sort({ date: -1 }).limit(limit)
        .populate('questionId', 'question').lean()
    ]);

    const activities = [];

    quizzes.forEach(q => {
      activities.push({
        type: 'quiz',
        title: `Completed ${q.topic} quiz`,
        detail: `Score: ${q.score}/${q.total} (${q.percentage}%)`,
        date: q.date
      });
    });

    dsaEntries.forEach(d => {
      activities.push({
        type: 'dsa',
        title: `Solved DSA problem`,
        detail: d.questionId ? d.questionId.question : 'Unknown problem',
        date: d.date
      });
    });

    hrEntries.forEach(h => {
      activities.push({
        type: 'hr',
        title: `Practiced HR question`,
        detail: h.questionId ? h.questionId.question : 'Unknown question',
        date: h.date
      });
    });

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: activities.slice(0, limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
