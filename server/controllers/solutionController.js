/**
 * Solution Controller
 * Handles text solutions and video solutions for questions
 */

const Solution = require('../models/Solution');
const VideoSolution = require('../models/VideoSolution');
const Question = require('../models/Question');

/**
 * Get solution for a question
 * GET /api/solutions/:questionId
 */
exports.getSolution = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    // Get text solution
    const solution = await Solution.findOne({ questionId })
      .populate('relatedProblems.questionId', 'question topic difficulty');
    
    // Get video solution
    const videoSolution = await VideoSolution.findOne({ questionId, isActive: true });
    
    // Get the question for context
    const question = await Question.findById(questionId).select('question topic difficulty solution type');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Build response with fallback to question's basic solution
    const response = {
      questionId,
      question: question.question,
      topic: question.topic,
      difficulty: question.difficulty,
      type: question.type,
      
      // Text solution parts
      basicSolution: question.solution || '', // Fallback basic solution from Question model
      hasDetailedSolution: !!solution,
      
      // Detailed solution (if exists)
      ...(solution && {
        intuition: solution.intuition,
        algorithmWalkthrough: solution.algorithmWalkthrough,
        complexity: solution.complexity,
        edgeCases: solution.edgeCases,
        commonMistakes: solution.commonMistakes,
        codeSolutions: solution.codeSolutions,
        correctAnswerExplanation: solution.correctAnswerExplanation,
        wrongOptionsExplanations: solution.wrongOptionsExplanations,
        relatedProblems: solution.relatedProblems,
        externalLinks: solution.externalLinks,
        tags: solution.tags,
        difficultyToUnderstand: solution.difficultyToUnderstand
      }),
      
      // Video solution (if exists)
      hasVideoSolution: !!videoSolution,
      ...(videoSolution && {
        video: {
          url: videoSolution.videoUrl,
          embedUrl: videoSolution.getEmbedUrl(),
          platform: videoSolution.platform,
          title: videoSolution.title,
          author: videoSolution.author,
          duration: videoSolution.duration,
          thumbnailUrl: videoSolution.thumbnailUrl,
          startTime: videoSolution.startTime,
          endTime: videoSolution.endTime
        }
      })
    };
    
    res.json({
      success: true,
      data: response
    });
    
  } catch (err) {
    console.error('Get solution error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch solution'
    });
  }
};

/**
 * Get code solutions for a specific language
 * GET /api/solutions/:questionId/code/:language
 */
exports.getCodeSolution = async (req, res) => {
  try {
    const { questionId, language } = req.params;
    
    const validLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Supported: ' + validLanguages.join(', ')
      });
    }
    
    const solution = await Solution.findOne({ questionId });
    
    if (!solution || !solution.codeSolutions[language] || !solution.codeSolutions[language].code) {
      // Fallback to basic solution from Question
      const question = await Question.findById(questionId).select('solution');
      return res.json({
        success: true,
        data: {
          language,
          code: '',
          explanation: question?.solution || 'No code solution available for this language.'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        language,
        code: solution.codeSolutions[language].code,
        explanation: solution.codeSolutions[language].explanation
      }
    });
    
  } catch (err) {
    console.error('Get code solution error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch code solution'
    });
  }
};

/**
 * Get all code solutions for a question (all languages)
 * GET /api/solutions/:questionId/code
 */
exports.getAllCodeSolutions = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const solution = await Solution.findOne({ questionId });
    
    if (!solution) {
      return res.json({
        success: true,
        data: {
          available: [],
          solutions: {}
        }
      });
    }
    
    // Find which languages have code
    const available = [];
    const solutions = {};
    
    for (const [lang, data] of Object.entries(solution.codeSolutions || {})) {
      if (data && data.code) {
        available.push(lang);
        solutions[lang] = data;
      }
    }
    
    res.json({
      success: true,
      data: {
        available,
        solutions
      }
    });
    
  } catch (err) {
    console.error('Get all code solutions error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch code solutions'
    });
  }
};

/**
 * Get video solution for a question
 * GET /api/solutions/:questionId/video
 */
exports.getVideoSolution = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const videoSolution = await VideoSolution.findOne({ questionId, isActive: true });
    
    if (!videoSolution) {
      return res.json({
        success: true,
        data: null,
        message: 'No video solution available'
      });
    }
    
    // Increment view count
    videoSolution.viewCount += 1;
    await videoSolution.save();
    
    res.json({
      success: true,
      data: {
        url: videoSolution.videoUrl,
        embedUrl: videoSolution.getEmbedUrl(),
        platform: videoSolution.platform,
        videoId: videoSolution.videoId,
        title: videoSolution.title,
        author: videoSolution.author,
        duration: videoSolution.duration,
        thumbnailUrl: videoSolution.thumbnailUrl,
        description: videoSolution.description,
        startTime: videoSolution.startTime,
        endTime: videoSolution.endTime,
        language: videoSolution.language,
        viewCount: videoSolution.viewCount
      }
    });
    
  } catch (err) {
    console.error('Get video solution error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video solution'
    });
  }
};

/**
 * Create or update a text solution (admin)
 * POST /api/solutions/:questionId
 */
exports.upsertSolution = async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      intuition,
      algorithmWalkthrough,
      complexity,
      edgeCases,
      commonMistakes,
      codeSolutions,
      correctAnswerExplanation,
      wrongOptionsExplanations,
      relatedProblems,
      externalLinks,
      tags,
      difficultyToUnderstand,
      isComplete
    } = req.body;
    
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Upsert solution
    const solution = await Solution.findOneAndUpdate(
      { questionId },
      {
        questionId,
        intuition,
        algorithmWalkthrough,
        complexity,
        edgeCases,
        commonMistakes,
        codeSolutions,
        correctAnswerExplanation,
        wrongOptionsExplanations,
        relatedProblems,
        externalLinks,
        tags,
        difficultyToUnderstand,
        isComplete
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Solution saved successfully',
      data: solution
    });
    
  } catch (err) {
    console.error('Upsert solution error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save solution'
    });
  }
};

/**
 * Add or update video solution (admin)
 * POST /api/solutions/:questionId/video
 */
exports.upsertVideoSolution = async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      videoUrl,
      title,
      author,
      duration,
      thumbnailUrl,
      description,
      startTime,
      endTime,
      language
    } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required'
      });
    }
    
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Upsert video solution
    const videoSolution = await VideoSolution.findOneAndUpdate(
      { questionId },
      {
        questionId,
        videoUrl,
        title: title || question.question,
        author,
        duration: duration || 0,
        thumbnailUrl,
        description,
        startTime: startTime || 0,
        endTime,
        language: language || 'en',
        isActive: true,
        lastVerified: new Date()
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Video solution saved successfully',
      data: {
        url: videoSolution.videoUrl,
        embedUrl: videoSolution.getEmbedUrl(),
        platform: videoSolution.platform,
        title: videoSolution.title
      }
    });
    
  } catch (err) {
    console.error('Upsert video solution error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save video solution'
    });
  }
};

/**
 * Get related problems for a question
 * GET /api/solutions/:questionId/related
 */
exports.getRelatedProblems = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    // Get solution with related problems
    const solution = await Solution.findOne({ questionId })
      .populate('relatedProblems.questionId', 'question topic difficulty type');
    
    if (!solution || !solution.relatedProblems || solution.relatedProblems.length === 0) {
      // Auto-suggest related problems based on topic
      const question = await Question.findById(questionId);
      if (!question) {
        return res.json({ success: true, data: [] });
      }
      
      const autoRelated = await Question.find({
        _id: { $ne: questionId },
        topic: question.topic,
        type: question.type
      }).limit(5).select('question topic difficulty');
      
      return res.json({
        success: true,
        data: autoRelated.map(q => ({
          questionId: q._id,
          title: q.question,
          topic: q.topic,
          difficulty: q.difficulty,
          relationship: 'same-topic'
        }))
      });
    }
    
    res.json({
      success: true,
      data: solution.relatedProblems.map(rp => ({
        questionId: rp.questionId?._id,
        title: rp.questionId?.question || rp.title,
        topic: rp.questionId?.topic,
        difficulty: rp.questionId?.difficulty,
        relationship: rp.relationship
      }))
    });
    
  } catch (err) {
    console.error('Get related problems error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related problems'
    });
  }
};
