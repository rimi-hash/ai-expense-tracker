/**
 * Anomaly Detection Utility
 * Detects unusual spending patterns
 */

const Expense = require('../models/Expense');

/**
 * Calculate statistical anomalies in expenses
 * Uses Z-score method for outlier detection
 */
const detectAnomalies = async (userId, currentMonth = null) => {
  try {
    // Get user's expenses from last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const expenses = await Expense.find({
      userId,
      date: { $gte: threeMonthsAgo }
    });

    if (expenses.length < 5) {
      return []; // Need minimum data for anomaly detection
    }

    const amounts = expenses.map(e => e.amount);
    const mean = amounts.reduce((a, b) => a + b) / amounts.length;
    const variance = amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2)) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Z-score threshold of 2.5 (marks as anomaly)
    const threshold = 2.5;
    const anomalies = [];

    expenses.forEach(expense => {
      const zScore = Math.abs((expense.amount - mean) / (stdDev || 1));
      
      if (zScore > threshold) {
        anomalies.push({
          expenseId: expense._id,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          anomalyScore: Math.min(zScore / 5, 1), // Normalize to 0-1
          reason: `Amount (${expense.amount}) is ${zScore.toFixed(2)}x standard deviation away from mean (${mean.toFixed(2)})`
        });
      }
    });

    return anomalies;
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return [];
  }
};

module.exports = {
  detectAnomalies
};
