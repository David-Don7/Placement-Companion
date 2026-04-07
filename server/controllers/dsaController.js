const Question = require('../models/Question');
const DSAProgress = require('../models/DSAProgress');

// @desc    Get DSA problems with optional filters
// @route   GET /api/dsa/problems
exports.getProblems = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const filter = { type: 'dsa' };
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const problems = await Question.find(filter).select('-answer -solution -options');

    // Get user's solved status
    const solved = await DSAProgress.find({
      userId: req.user._id,
      solved: true
    }).select('questionId');

    const solvedSet = new Set(solved.map(s => s.questionId.toString()));

    const data = problems.map(p => ({
      _id: p._id,
      topic: p.topic,
      difficulty: p.difficulty,
      question: p.question,
      solved: solvedSet.has(p._id.toString())
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get a single DSA problem with solution
// @route   GET /api/dsa/problems/:id
exports.getProblem = async (req, res) => {
  try {
    const problem = await Question.findById(req.params.id);
    if (!problem || problem.type !== 'dsa') {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const progress = await DSAProgress.findOne({
      userId: req.user._id,
      questionId: problem._id
    });

    res.json({
      success: true,
      data: {
        _id: problem._id,
        topic: problem.topic,
        difficulty: problem.difficulty,
        question: problem.question,
        solution: problem.solution,
        solved: progress ? progress.solved : false
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle solved status
// @route   POST /api/dsa/problems/:id/toggle
exports.toggleSolved = async (req, res) => {
  try {
    const problem = await Question.findById(req.params.id);
    if (!problem || problem.type !== 'dsa') {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    let progress = await DSAProgress.findOne({
      userId: req.user._id,
      questionId: problem._id
    });

    if (progress) {
      progress.solved = !progress.solved;
      progress.date = Date.now();
      await progress.save();
    } else {
      progress = await DSAProgress.create({
        userId: req.user._id,
        questionId: problem._id,
        solved: true
      });
    }

    res.json({ success: true, data: { solved: progress.solved } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get DSA stats
// @route   GET /api/dsa/stats
exports.getDSAStats = async (req, res) => {
  try {
    const totalProblems = await Question.countDocuments({ type: 'dsa' });
    const solvedCount = await DSAProgress.countDocuments({
      userId: req.user._id,
      solved: true
    });

    // Per-topic breakdown
    const solved = await DSAProgress.find({
      userId: req.user._id,
      solved: true
    }).select('questionId date');
    const solvedIds = solved.map(s => s.questionId);

    const allProblems = await Question.find({ type: 'dsa' }).select('topic difficulty');
    const solvedProblems = await Question.find({ _id: { $in: solvedIds }, type: 'dsa' }).select('topic difficulty');

    // Calculate difficulty-based stats
    const easySolved = solvedProblems.filter(p => p.difficulty === 'easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'hard').length;

    // Calculate streak (consecutive days with at least one solve)
    let streak = 0;
    if (solved.length > 0) {
      const sortedDates = solved
        .map(s => new Date(s.date).toDateString())
        .filter((date, index, self) => self.indexOf(date) === index)
        .sort((a, b) => new Date(b) - new Date(a));
      
      const today = new Date().toDateString();
      if (sortedDates[0] === today || sortedDates[0] === new Date(Date.now() - 86400000).toDateString()) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const previousDate = new Date(sortedDates[i - 1]);
          const diffDays = Math.floor((previousDate - currentDate) / 86400000);
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    const topicTotal = {};
    const topicSolved = {};
    allProblems.forEach(p => { topicTotal[p.topic] = (topicTotal[p.topic] || 0) + 1; });
    solvedProblems.forEach(p => { topicSolved[p.topic] = (topicSolved[p.topic] || 0) + 1; });

    const topicStats = {};
    Object.keys(topicTotal).forEach(t => {
      topicStats[t] = {
        total: topicTotal[t],
        solved: topicSolved[t] || 0
      };
    });

    res.json({
      success: true,
      data: { 
        totalProblems, 
        solvedCount, 
        easySolved,
        mediumSolved,
        hardSolved,
        streak,
        topicStats 
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
