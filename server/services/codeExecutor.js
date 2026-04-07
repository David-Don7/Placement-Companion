/**
 * Code Executor Service
 * Handles code compilation and execution using Judge0 API
 * For now, uses mock execution. Easy to swap with real Judge0 API.
 */

const axios = require('axios');

class CodeExecutor {
  // Judge0 API Configuration (get free API from: https://judge0.com/)
  static JUDGE0_API = process.env.JUDGE0_API || 'https://judge0-ce.p.rapidapi.com';
  static JUDGE0_KEY = process.env.JUDGE0_KEY || 'mock-key'; // Set in .env

  // Language ID mappings for Judge0
  static LANGUAGE_IDS = {
    'C': 50,
    'C++': 52,
    'Java': 62
  };

  /**
   * Execute code against test cases
   * @param {string} code - User's code
   * @param {string} language - Programming language (C, C++, Java)
   * @param {Array} testCases - Array of {input, expectedOutput}
   * @param {string} boilerplate - Template/wrapper code if needed
   * @returns {Object} Execution result
   */
  static async executeCode(code, language, testCases, boilerplate = '') {
    try {
      const finalCode = boilerplate ? this._wrapCode(boilerplate, code) : code;
      const languageId = this.LANGUAGE_IDS[language];

      if (!languageId) {
        return {
          status: 'Compilation Error',
          testResults: [],
          compilerOutput: `Unsupported language: ${language}`,
          executionTime: 0,
          memoryUsed: 0
        };
      }

      // If using real Judge0 API, uncomment below:
      // return await this._executeWithJudge0(finalCode, languageId, testCases);

      // For now, use mock execution
      return await this._executeMock(finalCode, language, testCases);
    } catch (err) {
      console.error('Code execution error:', err.message);
      return {
        status: 'Runtime Error',
        testResults: [],
        runtimeError: err.message,
        executionTime: 0,
        memoryUsed: 0
      };
    }
  }

  /**
   * Mock execution (for development)
   * Replace with real Judge0 API call in production
   * Provides deterministic, predictable results based on code quality
   */
  static async _executeMock(code, language, testCases) {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check for common issues in code
    const hasReturn = code.includes('return');
    const hasLogic = code.includes('=') || code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/');
    const isEmpty = code.trim().length === 0 || (code.includes('// Your code here') && code.trim().length < 50);

    // If code is empty or just placeholder, fail all tests with compilation error
    if (isEmpty) {
      const testResults = testCases.map((tc, idx) => ({
        testCaseIndex: idx,
        passed: false,
        expected: tc.expectedOutput,
        actual: '',
        error: 'Compilation Error: Empty implementation'
      }));

      return {
        status: 'Compilation Error',
        testResults,
        executionTime: 0,
        memoryUsed: 0,
        compilerOutput: `error: function does not return a value\nerror: expected '}' at end of declaration`,
        runtimeError: ''
      };
    }

    // Check for syntax errors (basic indicators)
    const bracketBalance = (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length;
    if (bracketBalance !== 0) {
      const testResults = testCases.map((tc, idx) => ({
        testCaseIndex: idx,
        passed: false,
        expected: tc.expectedOutput,
        actual: '',
        error: 'Syntax Error: Mismatched braces'
      }));

      return {
        status: 'Compilation Error',
        testResults,
        executionTime: 0,
        memoryUsed: 0,
        compilerOutput: `error: expected '}' before end of file\nerror: syntax error`,
        runtimeError: ''
      };
    }

    // Determine quality based on code structure
    const hasProperLogic = hasReturn && (code.includes('for') || code.includes('while') || code.includes('if') || hasLogic);
    
    // Quality levels determine pass rate:
    // - No logic: 0% (empty loops/conditions)
    // - Basic logic: 40% (simple if/variable assignments)
    // - Good logic: 70% (includes loops and conditions)
    // - Excellent logic: 90% (comprehensive implementation)
    
    let passRate;
    if (!hasReturn) {
      passRate = 0.2; // Missing return = likely wrong
    } else if (code.includes('// Your code here')) {
      passRate = 0.25; // Still has placeholder comment
    } else if (!hasProperLogic) {
      passRate = 0.4; // Has return but minimal logic
    } else if (code.split('\n').length > 15 && code.includes('for') && code.includes('if')) {
      passRate = 0.85; // Good comprehensive solution
    } else {
      passRate = 0.65; // Decent attempt with some logic
    }

    // Generate deterministic results: same code always produces same results
    const testResults = testCases.map((tc, idx) => {
      // DETERMINISTIC: use code structure analysis, not random
      // Pass based on code quality and test index
      const baseLogicScore = hasProperLogic ? 100 : (hasLogic ? 60 : 20);
      const scoreVariation = (baseLogicScore * passRate) + (idx * 5); // Each test has slightly better chance
      const shouldPass = scoreVariation > 50; // Threshold-based decision

      return {
        testCaseIndex: idx,
        passed: shouldPass,
        expected: tc.expectedOutput,
        actual: shouldPass ? tc.expectedOutput : `Unexpected output for test case ${idx + 1}`,
        error: shouldPass ? '' : `Wrong Answer: Expected "${tc.expectedOutput}"`
      };
    });

    const allPassed = testResults.every(tr => tr.passed);
    const passedCount = testResults.filter(tr => tr.passed).length;

    // Execution time based on code complexity
    const codeLength = code.length;
    const loopCount = (code.match(/for|while/g) || []).length;
    const executionTime = 50 + Math.min(codeLength / 10, 200) + (loopCount * 30);

    return {
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      testResults,
      executionTime: Math.round(executionTime),
      memoryUsed: Math.round(512 + (codeLength / 2) + (loopCount * 128)),
      compilerOutput: '',
      runtimeError: ''
    };
  }

  /**
   * Execute code using real Judge0 API
   * Note: Requires Judge0 API key (RapidAPI or self-hosted)
   */
  static async _executeWithJudge0(code, languageId, testCases) {
    try {
      const testResults = [];
      let allPassed = true;

      for (let idx = 0; idx < testCases.length; idx++) {
        const tc = testCases[idx];
        
        const submission = {
          source_code: code,
          language_id: languageId,
          stdin: tc.input,
          expected_output: tc.expectedOutput,
          cpu_time_limit: 5,
          memory_limit: 128000
        };

        // Submit code to Judge0
        const response = await axios.post(
          `${this.JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
          submission,
          {
            headers: {
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
              'X-RapidAPI-Key': this.JUDGE0_KEY,
              'Content-Type': 'application/json'
            }
          }
        );

        const result = response.data;

        const passed = result.status.id <= 4 && result.stdout === tc.expectedOutput;
        if (!passed) allPassed = false;

        testResults.push({
          testCaseIndex: idx,
          passed,
          expected: tc.expectedOutput,
          actual: result.stdout || '',
          error: result.stderr || ''
        });
      }

      return {
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        testResults,
        executionTime: 1000,
        memoryUsed: 5000,
        compilerOutput: '',
        runtimeError: ''
      };
    } catch (err) {
      console.error('Judge0 execution error:', err.message);
      throw err;
    }
  }

  /**
   * Wrap user code with boilerplate/template
   */
  static _wrapCode(boilerplate, userCode) {
    return boilerplate.replace('// YOUR_CODE_HERE', userCode);
  }

  /**
   * Validate code syntax (basic)
   */
  static validateSyntax(code, language) {
    if (!code || code.trim().length === 0) {
      return { valid: false, error: 'Code cannot be empty' };
    }

    if (code.length > 100000) {
      return { valid: false, error: 'Code is too large (max 100KB)' };
    }

    return { valid: true };
  }
}

module.exports = CodeExecutor;
