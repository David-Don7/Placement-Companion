/**
 * Recommendation Engine for Aptitude Test Performance
 * Generates actionable insights based on user performance
 */

class RecommendationEngine {
  /**
   * Generate recommendations based on performance data
   * @param {Object} performanceData - Category-wise performance breakdown
   * @param {Object} overallMetrics - Overall test metrics
   * @returns {Array} Array of recommendation strings
   */
  static generateRecommendations(performanceData, overallMetrics) {
    const recommendations = [];
    const avgAccuracy = overallMetrics.percentage;
    
    // Analyze each category
    const categoryPerformance = [];
    performanceData.forEach(cat => {
      categoryPerformance.push({
        category: cat.category,
        accuracy: cat.accuracy,
        timePerQuestion: cat.timeSpent / cat.questionsAttempted
      });
    });

    // Sort by accuracy to identify weaknesses
    categoryPerformance.sort((a, b) => a.accuracy - b.accuracy);

    // Generate recommendations based on weaknesses (bottom 2 categories)
    for (let i = 0; i < Math.min(2, categoryPerformance.length); i++) {
      const weak = categoryPerformance[i];
      
      if (weak.accuracy < 50) {
        recommendations.push(
          `Focus on fundamentals of ${weak.category}. Your accuracy is ${weak.accuracy}% - start with basic concepts and gradually increase difficulty.`
        );
      } else if (weak.accuracy < 70) {
        recommendations.push(
          `Practice more ${weak.category} problems. You're at ${weak.accuracy}% - try solving more medium-level problems to strengthen this area.`
        );
      }
    }

    // Time management recommendations
    const avgTimePerQn = overallMetrics.totalTimeSeconds / overallMetrics.attemptedQuestions;
    const slowCategory = categoryPerformance.find(cat => cat.timePerQuestion > avgTimePerQn * 1.5);
    
    if (slowCategory) {
      recommendations.push(
        `Improve your speed in ${slowCategory.category}. You spend ${(slowCategory.timePerQuestion).toFixed(1)} seconds per question here - try to optimize your approach.`
      );
    }

    // Accuracy vs Speed recommendations
    if (avgAccuracy < 50 && overallMetrics.totalTimeSeconds / overallMetrics.attemptedQuestions < 20) {
      recommendations.push(
        `Reduce guessing and spend more time analyzing questions. Speed is good but accuracy needs improvement.`
      );
    } else if (avgAccuracy > 80 && overallMetrics.totalTimeSeconds / overallMetrics.attemptedQuestions > 40) {
      recommendations.push(
        `Great accuracy! Now work on increasing your speed. Try solving problems with tighter time limits.`
      );
    }

    // Skipped questions recommendation
    if (overallMetrics.skippedQuestions > 0) {
      recommendations.push(
        `You skipped ${overallMetrics.skippedQuestions} questions. Try to attempt all questions - even partial knowledge helps.`
      );
    }

    // Overall strategy
    if (avgAccuracy < 50) {
      recommendations.push(
        `Your overall score is ${avgAccuracy}%. Review basic concepts across all topics and take quizzes regularly to improve.`
      );
    } else if (avgAccuracy < 70) {
      recommendations.push(
        `You're making progress! Consistency is key. Take regular practice quizzes and track improvement over time.`
      );
    } else {
      recommendations.push(
        `Excellent work! Continue solving harder problems to maintain and improve your skills further.`
      );
    }

    return recommendations.slice(0, 5); // Return max 5 recommendations
  }

  /**
   * Classify user's skill level based on comprehensive metrics
   * @param {number} percentage - Overall accuracy percentage
   * @param {Array} categoryAnalysis - Category-wise breakdown
   * @param {number} avgTimePerQuestion - Average time spent per question
   * @returns {Object} { level, explanation }
   */
  static classifySkillLevel(percentage, categoryAnalysis, avgTimePerQuestion) {
    let level;
    let explanation = '';

    // Calculate category balance
    const accuracies = categoryAnalysis.map(c => c.accuracy);
    const minAccuracy = Math.min(...accuracies);
    const maxAccuracy = Math.max(...accuracies);
    const balance = maxAccuracy - minAccuracy;

    if (percentage <= 40) {
      level = 'Beginner';
      explanation = `You're just starting your preparation journey. Focus on building strong fundamentals across all topics. Don't rush—consistent practice will help you improve steadily.`;
    } else if (percentage <= 60) {
      level = 'Amateur';
      explanation = `You have basic understanding but performance is inconsistent across topics. Identify weak areas and practice more problems in those sections. Your understanding is shaky in some areas.`;
    } else if (percentage <= 80) {
      level = 'Intermediate';
      if (balance > 20) {
        explanation = `You have decent overall knowledge but imbalanced performance. Focus on strengthening weaker topics while maintaining your strong areas.`;
      } else {
        explanation = `Good balanced performance! You understand most concepts well. Continue practicing to increase confidence and speed in all areas.`;
      }
    } else {
      level = 'Advanced';
      if (avgTimePerQuestion < 30) {
        explanation = `Excellent! You have strong fundamentals, good accuracy, fast problem-solving, and consistent performance across topics. You're well-prepared for placement exams.`;
      } else {
        explanation = `Outstanding accuracy and balanced knowledge! Your speed is still improvable. Practice timed quizzes to enhance your overall performance.`;
      }
    }

    return { level, explanation };
  }

  /**
   * Determine speed vs accuracy insight
   * @param {number} percentage - Overall accuracy
   * @param {number} avgTimePerQuestion - Average time per question in seconds
   * @returns {string} Insight text
   */
  static getSpeedAccuracyInsight(percentage, avgTimePerQuestion) {
    if (percentage >= 75 && avgTimePerQuestion <= 30) {
      return 'Fast and Accurate';
    } else if (percentage >= 70 && avgTimePerQuestion <= 25) {
      return 'Fast and Accurate';
    } else if (percentage < 60 && avgTimePerQuestion <= 25) {
      return 'Fast but Error-prone';
    } else if (percentage >= 70 && avgTimePerQuestion > 40) {
      return 'Slow but Accurate';
    } else {
      return 'Slow and Needs Practice';
    }
  }

  /**
   * Identify strengths and weaknesses
   * @param {Array} categoryAnalysis - Category-wise breakdown
   * @returns {Object} { strengths, weaknesses }
   */
  static analyzeStrengthsWeaknesses(categoryAnalysis) {
    const analysis = categoryAnalysis.map(cat => ({
      category: cat.category,
      accuracy: cat.accuracy,
      level: cat.accuracy >= 80 ? 'Strong' : cat.accuracy >= 50 ? 'Average' : 'Weak'
    }));

    return {
      strengths: analysis.filter(a => a.level === 'Strong'),
      weaknesses: analysis.filter(a => a.level === 'Weak')
    };
  }
}

module.exports = RecommendationEngine;
