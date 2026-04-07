const CodingQuestion = require('../models/CodingQuestion');
const CodeSubmission = require('../models/CodeSubmission');
const CodeExecutor = require('../services/codeExecutor');

// @desc    Get all coding questions with filters
// @route   GET /api/coding/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    const { difficulty, topic, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;

    const skip = (page - 1) * limit;
    const total = await CodingQuestion.countDocuments(filter);
    
    const questions = await CodingQuestion.find(filter)
      .select('-testCases') // Hide test cases from listing
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: questions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: questions.length,
        totalRecords: total
      }
    });
  } catch (err) {
    console.error('Coding getQuestions error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single coding question with boilerplate
// @route   GET /api/coding/question/:id
// @access  Private
exports.getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const question = await CodingQuestion.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (err) {
    console.error('Coding getQuestion error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit code solution
// @route   POST /api/coding/submit
// @access  Private
exports.submitCode = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;

    if (!questionId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Question ID, code, and language are required'
      });
    }

    const question = await CodingQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Get user's previous submission count (for attempt tracking)
    const previousSubmissions = await CodeSubmission.countDocuments({
      userId: req.user._id,
      questionId
    });

    // Execute code against test cases
    const execution = await CodeExecutor.executeCode(
      code,
      language,
      question.testCases,
      question.boilerplate[language.toLowerCase()]
    );

    // Create submission record
    const submission = await CodeSubmission.create({
      userId: req.user._id,
      questionId,
      code,
      language,
      status: execution.status,
      testResults: execution.testResults,
      executionTime: execution.executionTime,
      memoryUsed: execution.memoryUsed,
      compilerOutput: execution.compilerOutput,
      runtimeError: execution.runtimeError,
      attempt: previousSubmissions + 1
    });

    // Update question stats if accepted
    if (execution.status === 'Accepted') {
      await CodingQuestion.findByIdAndUpdate(questionId, {
        $inc: { submissionCount: 1, acceptedCount: 1 },
        $set: { acceptanceRate: Math.round(((await CodingQuestion.findById(questionId)).acceptedCount + 1) / (submissionCount + 1) * 100) }
      });
    } else {
      await CodingQuestion.findByIdAndUpdate(questionId, {
        $inc: { submissionCount: 1 }
      });
    }

    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        status: execution.status,
        testResults: execution.testResults,
        executionTime: execution.executionTime,
        memoryUsed: execution.memoryUsed,
        compilerOutput: execution.compilerOutput,
        runtimeError: execution.runtimeError,
        passedTests: execution.testResults.filter(t => t.passed).length,
        totalTests: execution.testResults.length
      }
    });
  } catch (err) {
    console.error('Coding submitCode error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's submission history for a question
// @route   GET /api/coding/submissions/:questionId
// @access  Private
exports.getSubmissions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const total = await CodeSubmission.countDocuments({
      userId: req.user._id,
      questionId
    });

    const submissions = await CodeSubmission.find({
      userId: req.user._id,
      questionId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-code'); // Don't return full code in listing

    res.json({
      success: true,
      data: submissions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Coding getSubmissions error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single submission details
// @route   GET /api/coding/submission/:submissionId
// @access  Private
exports.getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await CodeSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Verify ownership
    if (submission.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (err) {
    console.error('Coding getSubmission error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's coding practice stats
// @route   GET /api/coding/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const totalSubmissions = await CodeSubmission.countDocuments({
      userId: req.user._id
    });

    const acceptedSubmissions = await CodeSubmission.countDocuments({
      userId: req.user._id,
      status: 'Accepted'
    });

    const uniqueProblems = await CodeSubmission.distinct('questionId', {
      userId: req.user._id,
      status: 'Accepted'
    });

    const stats = {
      totalSubmissions,
      acceptedSubmissions,
      solvedProblems: uniqueProblems.length,
      successRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Coding getUserStats error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
