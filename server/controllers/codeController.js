const CodeSubmission = require('../models/CodeSubmission');
const CodeTemplate = require('../models/CodeTemplate');
const TestCase = require('../models/TestCase');
const Question = require('../models/Question');
const DSAProgress = require('../models/DSAProgress');
const UserActivity = require('../models/UserActivity');

/**
 * Code Execution Controller
 * Handles code submissions, execution via Piston API, and results
 * 
 * We use Piston (https://github.com/engineer-man/piston) as the code execution engine
 * It's free, open-source, and supports many languages
 */

// Piston API configuration
const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

// Language configuration for Piston
const LANGUAGE_CONFIG = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' }
};

// Default code templates when none exist in DB
const DEFAULT_TEMPLATES = {
  python: (funcName) => `def ${funcName}(nums, target):
    # Write your solution here
    pass

# Do not modify below this line
if __name__ == "__main__":
    import sys
    import json
    input_data = json.loads(sys.stdin.read())
    result = ${funcName}(**input_data)
    print(json.dumps(result))`,
  
  javascript: (funcName) => `function ${funcName}(nums, target) {
    // Write your solution here
    
}

// Do not modify below this line
const input = require('fs').readFileSync(0, 'utf8');
const data = JSON.parse(input);
const result = ${funcName}(data.nums, data.target);
console.log(JSON.stringify(result));`,

  java: (funcName, className = 'Solution') => `import java.util.*;

class ${className} {
    public int[] ${funcName}(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        // Test your solution
        ${className} sol = new ${className}();
        int[] result = sol.${funcName}(new int[]{2,7,11,15}, 9);
        System.out.println(Arrays.toString(result));
    }
}`,

  cpp: (funcName) => `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> ${funcName}(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = sol.${funcName}(nums, target);
    for (int n : result) cout << n << " ";
    return 0;
}`
};

/**
 * @desc    Get problem details with code templates
 * @route   GET /api/code/problem/:questionId
 */
exports.getProblem = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    // Get the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    
    // Get code templates
    let templates = await CodeTemplate.findOne({ questionId });
    
    // Get sample test cases (non-hidden)
    const sampleTestCases = await TestCase.find({ 
      questionId, 
      isSample: true 
    }).sort('order');
    
    // Get user's previous submissions for this problem
    const previousSubmissions = await CodeSubmission.find({
      userId: req.user._id,
      questionId
    }).sort('-submittedAt').limit(10).select('language verdict submittedAt metrics');
    
    // Check if user has solved this problem
    const progress = await DSAProgress.findOne({
      userId: req.user._id,
      questionId
    });
    
    res.json({
      success: true,
      data: {
        question: {
          _id: question._id,
          title: question.question,
          topic: question.topic,
          difficulty: question.difficulty,
          description: question.solution || '',
          hints: question.hints || []
        },
        templates: templates ? templates.templates : null,
        inputFormat: templates?.inputFormat || '',
        outputFormat: templates?.outputFormat || '',
        constraints: templates?.constraints || [],
        sampleTestCases: sampleTestCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          description: tc.description
        })),
        previousSubmissions,
        isSolved: progress?.solved || false,
        supportedLanguages: Object.keys(LANGUAGE_CONFIG)
      }
    });
  } catch (err) {
    console.error('getProblem error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Run code against sample test cases
 * @route   POST /api/code/run
 */
exports.runCode = async (req, res) => {
  try {
    const { questionId, language, code, customInput } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({ success: false, message: 'Language and code are required' });
    }
    
    if (!LANGUAGE_CONFIG[language]) {
      return res.status(400).json({ success: false, message: 'Unsupported language' });
    }
    
    let testCases = [];
    
    if (customInput) {
      // Run with custom input
      testCases = [{ input: customInput, expectedOutput: '', isCustom: true }];
    } else if (questionId) {
      // Get sample test cases
      testCases = await TestCase.find({ questionId, isSample: true }).sort('order');
      if (testCases.length === 0) {
        // If no sample test cases, create a basic one
        testCases = [{ input: '', expectedOutput: '', isCustom: true }];
      }
    } else {
      // No question, just run the code
      testCases = [{ input: '', expectedOutput: '', isCustom: true }];
    }
    
    // Execute code
    const results = await executeCode(language, code, testCases);
    
    // Create submission record
    const submission = await CodeSubmission.create({
      userId: req.user._id,
      questionId: questionId || null,
      language,
      code,
      submissionType: 'run',
      verdict: results.some(r => r.error) ? 'runtime-error' : 'pending',
      testResults: results,
      metrics: {
        totalTestCases: results.length,
        passedTestCases: results.filter(r => r.passed).length,
        runtime: results.reduce((sum, r) => sum + (r.runtime || 0), 0) / results.length,
        memory: Math.max(...results.map(r => r.memory || 0))
      },
      judgeService: 'piston',
      executedAt: new Date()
    });
    
    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        results: results.map(r => ({
          input: r.input,
          expectedOutput: r.expectedOutput,
          actualOutput: r.actualOutput,
          passed: r.passed,
          runtime: r.runtime,
          memory: r.memory,
          error: r.error,
          isCustom: r.isCustom
        })),
        metrics: submission.metrics
      }
    });
  } catch (err) {
    console.error('runCode error:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

/**
 * @desc    Submit code for full evaluation
 * @route   POST /api/code/submit
 */
exports.submitCode = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;
    
    if (!questionId || !language || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Question ID, language, and code are required' 
      });
    }
    
    if (!LANGUAGE_CONFIG[language]) {
      return res.status(400).json({ success: false, message: 'Unsupported language' });
    }
    
    // Get all test cases (including hidden)
    const testCases = await TestCase.find({ questionId }).sort('order');
    const hasOfficialTestCases = testCases.length > 0;

    // If no official test cases exist, run a syntax/runtime-only validation pass
    const executionCases = hasOfficialTestCases
      ? testCases
      : [{
          input: '',
          expectedOutput: '',
          isCustom: true,
          isHidden: false,
          timeLimit: 5000,
          memoryLimit: 256 * 1024 * 1024
        }];

    // Execute code against all available test cases
    const results = await executeCode(language, code, executionCases);

    // Determine verdict
    let verdict = hasOfficialTestCases ? 'accepted' : 'pending';
    const hasError = results.some(r => r.error);
    const allPassed = results.every(r => r.passed);
    
    if (hasError) {
      const errorResult = results.find(r => r.error);
      if (errorResult.error.includes('Time Limit')) {
        verdict = 'time-limit-exceeded';
      } else if (errorResult.error.includes('Memory')) {
        verdict = 'memory-limit-exceeded';
      } else if (errorResult.error.includes('Compilation') || errorResult.error.includes('SyntaxError')) {
        verdict = 'compilation-error';
      } else {
        verdict = 'runtime-error';
      }
    } else if (hasOfficialTestCases && !allPassed) {
      verdict = 'wrong-answer';
    }
    
    // Create submission record
    const submission = await CodeSubmission.create({
      userId: req.user._id,
      questionId,
      language,
      code,
      submissionType: 'submit',
      verdict,
      testResults: results.map(r => ({
        ...r,
        // Hide details for hidden test cases on wrong answer
        input: r.isHidden && verdict !== 'accepted' ? '[Hidden]' : r.input,
        expectedOutput: r.isHidden && verdict !== 'accepted' ? '[Hidden]' : r.expectedOutput
      })),
      metrics: {
        totalTestCases: results.length,
        passedTestCases: results.filter(r => r.passed).length,
        runtime: Math.round(results.reduce((sum, r) => sum + (r.runtime || 0), 0) / results.length),
        memory: Math.max(...results.map(r => r.memory || 0))
      },
      judgeService: 'piston',
      executedAt: new Date()
    });
    
    // Update DSA progress only when accepted against official test cases
    if (verdict === 'accepted' && hasOfficialTestCases) {
      await DSAProgress.findOneAndUpdate(
        { userId: req.user._id, questionId },
        { 
          $set: { 
            solved: true, 
            solvedAt: new Date(),
            lastSubmission: submission._id
          }
        },
        { upsert: true }
      );
      
      // Log activity
      await UserActivity.create({
        userId: req.user._id,
        activityType: 'problem-solved',
        entityType: 'question',
        entityId: questionId,
        data: { language, runtime: submission.metrics.runtime }
      });
    }
    
    // Calculate percentiles (simplified - would need actual data for real percentiles)
    if (verdict === 'accepted' && hasOfficialTestCases) {
      submission.metrics.runtimePercentile = Math.round(Math.random() * 40 + 50); // Mock: 50-90%
      submission.metrics.memoryPercentile = Math.round(Math.random() * 40 + 50);
      await submission.save();
    }
    
    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        verdict,
        results: results.map(r => ({
          passed: r.passed,
          runtime: r.runtime,
          memory: r.memory,
          error: r.error,
          isHidden: r.isHidden,
          // Only show details for passed or sample test cases
          input: r.isHidden && verdict !== 'accepted' ? '[Hidden]' : r.input,
          expectedOutput: r.isHidden && verdict !== 'accepted' ? '[Hidden]' : r.expectedOutput,
          actualOutput: r.actualOutput
        })),
        metrics: submission.metrics,
        note: hasOfficialTestCases
          ? ''
          : 'No official test cases configured for this problem yet. This result validates syntax/runtime only.'
      }
    });
  } catch (err) {
    console.error('submitCode error:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

/**
 * @desc    Get user's submission history for a problem
 * @route   GET /api/code/submissions/:questionId
 */
exports.getSubmissions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const submissions = await CodeSubmission.find({
      userId: req.user._id,
      questionId
    })
      .sort('-submittedAt')
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .select('language verdict submittedAt metrics submissionType');
    
    const total = await CodeSubmission.countDocuments({
      userId: req.user._id,
      questionId
    });
    
    res.json({
      success: true,
      data: {
        submissions,
        total,
        hasMore: parseInt(offset) + submissions.length < total
      }
    });
  } catch (err) {
    console.error('getSubmissions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a specific submission's details
 * @route   GET /api/code/submission/:submissionId
 */
exports.getSubmissionDetail = async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await CodeSubmission.findOne({
      _id: submissionId,
      userId: req.user._id
    });
    
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    res.json({
      success: true,
      data: submission
    });
  } catch (err) {
    console.error('getSubmissionDetail error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get supported languages and their configurations
 * @route   GET /api/code/languages
 */
exports.getLanguages = async (req, res) => {
  try {
    const languages = Object.entries(LANGUAGE_CONFIG).map(([key, config]) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      version: config.version,
      monacoLanguage: getMonacoLanguage(key)
    }));
    
    res.json({
      success: true,
      data: languages
    });
  } catch (err) {
    console.error('getLanguages error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get user's coding statistics
 * @route   GET /api/code/stats
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Total submissions
    const totalSubmissions = await CodeSubmission.countDocuments({ userId });
    
    // Accepted submissions
    const acceptedSubmissions = await CodeSubmission.countDocuments({ 
      userId, 
      verdict: 'accepted',
      submissionType: 'submit'
    });
    
    // Problems solved
    const problemsSolved = await DSAProgress.countDocuments({ userId, solved: true });
    
    // Language breakdown
    const languageStats = await CodeSubmission.aggregate([
      { $match: { userId } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent activity
    const recentSubmissions = await CodeSubmission.find({ userId })
      .sort('-submittedAt')
      .limit(5)
      .populate('questionId', 'question topic difficulty')
      .select('language verdict submittedAt questionId');
    
    // Verdict breakdown
    const verdictStats = await CodeSubmission.aggregate([
      { $match: { userId, submissionType: 'submit' } },
      { $group: { _id: '$verdict', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalSubmissions,
        acceptedSubmissions,
        problemsSolved,
        acceptanceRate: totalSubmissions > 0 
          ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
          : 0,
        languageStats: languageStats.map(l => ({ language: l._id, count: l.count })),
        verdictStats: verdictStats.map(v => ({ verdict: v._id, count: v.count })),
        recentSubmissions
      }
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Execute code using Piston API
 */
async function executeCode(language, code, testCases) {
  const config = LANGUAGE_CONFIG[language];
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const startTime = Date.now();
      
      const response = await fetch(`${PISTON_API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          files: [{ content: code }],
          stdin: testCase.input || '',
          args: [],
          compile_timeout: 10000,
          run_timeout: testCase.timeLimit || 5000,
          compile_memory_limit: -1,
          run_memory_limit: testCase.memoryLimit || -1
        })
      });
      
      const data = await response.json();
      const runtime = Date.now() - startTime;
      
      if (data.compile && data.compile.code !== 0) {
        // Compilation error
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          runtime,
          memory: 0,
          error: `Compilation Error: ${data.compile.stderr || data.compile.output}`,
          isHidden: testCase.isHidden,
          isCustom: testCase.isCustom
        });
        continue;
      }
      
      if (data.run) {
        const actualOutput = (data.run.stdout || '').trim();
        const expectedOutput = (testCase.expectedOutput || '').trim();
        const passed = testCase.isCustom || actualOutput === expectedOutput;
        
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
          runtime: runtime,
          memory: data.run.memory || 0,
          error: data.run.stderr || (data.run.code !== 0 ? `Exit code: ${data.run.code}` : ''),
          isHidden: testCase.isHidden,
          isCustom: testCase.isCustom
        });
      } else {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          runtime,
          memory: 0,
          error: data.message || 'Unknown error from code execution service',
          isHidden: testCase.isHidden,
          isCustom: testCase.isCustom
        });
      }
    } catch (err) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        passed: false,
        runtime: 0,
        memory: 0,
        error: `Execution error: ${err.message}`,
        isHidden: testCase.isHidden,
        isCustom: testCase.isCustom
      });
    }
  }
  
  return results;
}

/**
 * Map our language IDs to Monaco editor language IDs
 */
function getMonacoLanguage(language) {
  const mapping = {
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rust'
  };
  return mapping[language] || 'plaintext';
}
