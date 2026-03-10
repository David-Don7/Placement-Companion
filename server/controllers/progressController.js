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

    // Date boundaries for this week vs last week
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Quiz stats
    const quizResults = await QuizResult.find({ userId });
    const totalQuizzes = quizResults.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
      : 0;

    // Weekly quiz changes
    const quizzesThisWeek = quizResults.filter(r => new Date(r.date) >= weekAgo).length;
    const quizzesLastWeek = quizResults.filter(r => new Date(r.date) >= twoWeeksAgo && new Date(r.date) < weekAgo).length;
    const thisWeekScores = quizResults.filter(r => new Date(r.date) >= weekAgo);
    const lastWeekScores = quizResults.filter(r => new Date(r.date) >= twoWeeksAgo && new Date(r.date) < weekAgo);
    const avgThisWeek = thisWeekScores.length > 0 ? Math.round(thisWeekScores.reduce((s, r) => s + r.percentage, 0) / thisWeekScores.length) : 0;
    const avgLastWeek = lastWeekScores.length > 0 ? Math.round(lastWeekScores.reduce((s, r) => s + r.percentage, 0) / lastWeekScores.length) : 0;

    // DSA stats
    const totalDSA = await Question.countDocuments({ type: 'dsa' });
    const dsaSolved = await DSAProgress.countDocuments({ userId, solved: true });
    const dsaThisWeek = await DSAProgress.countDocuments({ userId, solved: true, date: { $gte: weekAgo } });

    // HR stats
    const hrPracticed = await HRAnswer.countDocuments({ userId });
    const hrThisWeek = await HRAnswer.countDocuments({ userId, date: { $gte: weekAgo } });

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
          streak: user.streak || 0,
          quizzesThisWeek,
          quizzesLastWeek,
          avgScoreChange: avgThisWeek - avgLastWeek,
          dsaThisWeek,
          hrThisWeek
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

// @desc    Get chart data (daily activity counts over a period)
// @route   GET /api/progress/chart?period=week|month|all
exports.getChartData = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = req.query.period || 'week';

    let startDate;
    const now = new Date();
    if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
    } else {
      // 'all' — last 90 days max
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 89);
    }
    startDate.setHours(0, 0, 0, 0);

    const dateFilter = { $gte: startDate };

    const [quizzes, dsaEntries, hrEntries] = await Promise.all([
      QuizResult.find({ userId, date: dateFilter }).select('date percentage topic').lean(),
      DSAProgress.find({ userId, solved: true, date: dateFilter }).select('date').lean(),
      HRAnswer.find({ userId, date: dateFilter }).select('date matchScore').lean()
    ]);

    // Build a map of date → counts
    const dayMap = {};
    const dayCount = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dayMap[key] = { quizzes: 0, dsa: 0, hr: 0, avgScore: 0, scores: [] };
    }

    quizzes.forEach(q => {
      const key = new Date(q.date).toISOString().split('T')[0];
      if (dayMap[key]) {
        dayMap[key].quizzes++;
        dayMap[key].scores.push(q.percentage);
      }
    });
    dsaEntries.forEach(d => {
      const key = new Date(d.date).toISOString().split('T')[0];
      if (dayMap[key]) dayMap[key].dsa++;
    });
    hrEntries.forEach(h => {
      const key = new Date(h.date).toISOString().split('T')[0];
      if (dayMap[key]) dayMap[key].hr++;
    });

    // Compute avg score per day
    Object.values(dayMap).forEach(v => {
      if (v.scores.length > 0) {
        v.avgScore = Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length);
      }
      delete v.scores;
    });

    const labels = Object.keys(dayMap);
    const quizData = labels.map(k => dayMap[k].quizzes);
    const dsaData = labels.map(k => dayMap[k].dsa);
    const hrData = labels.map(k => dayMap[k].hr);
    const scoreData = labels.map(k => dayMap[k].avgScore);

    res.json({
      success: true,
      data: { labels, quizData, dsaData, hrData, scoreData }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
