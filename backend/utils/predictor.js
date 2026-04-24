/**
 * Prediction Module
 * Uses simple linear regression for expense forecasting
 */

const Expense = require('../models/Expense');

/**
 * Predict next month's expenses using linear regression
 */
const predictNextMonth = async (userId) => {
  try {
    // Get expenses from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const expenses = await Expense.find({
      userId,
      date: { $gte: sixMonthsAgo }
    });

    if (expenses.length < 5) {
      return {
        predictions: {},
        totalPrediction: 0,
        confidence: 0,
        reason: 'Insufficient data for prediction'
      };
    }

    // Group by month
    const monthlyTotals = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }
      monthlyTotals[monthKey] += expense.amount;
    });

    // Sort months
    const sortedMonths = Object.keys(monthlyTotals).sort();
    const amounts = sortedMonths.map(m => monthlyTotals[m]);

    // Simple linear regression
    const n = amounts.length;
    const xMean = (n - 1) / 2;
    const yMean = amounts.reduce((a, b) => a + b) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    amounts.forEach((amount, index) => {
      const x = index;
      numerator += (x - xMean) * (amount - yMean);
      denominator += Math.pow(x - xMean, 2);
    });

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Predict next month (index = n)
    const nextMonthPrediction = intercept + slope * n;

    // Group predictions by category
    const categoryPredictions = {};
    const currentMonth = new Date();
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    
    // Get category percentages from current month
    const currentMonthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return mKey === monthKey;
    });

    const categoryTotals = {};
    const monthAmount = currentMonthExpenses.reduce((sum, e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      return sum + e.amount;
    }, 0);

    // Apply percentages to prediction
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      const percentage = monthAmount > 0 ? amount / monthAmount : 0;
      categoryPredictions[category] = nextMonthPrediction * percentage;
    });

    // Calculate confidence (R-squared)
    let ssRes = 0;
    let ssTot = 0;
    amounts.forEach((amount, index) => {
      const predicted = intercept + slope * index;
      ssRes += Math.pow(amount - predicted, 2);
      ssTot += Math.pow(amount - yMean, 2);
    });

    const rSquared = 1 - (ssRes / (ssTot || 1));
    const confidence = Math.max(0, Math.min(1, rSquared)); // Clamp to 0-1

    return {
      predictions: categoryPredictions,
      totalPrediction: Math.max(0, nextMonthPrediction),
      confidence: parseFloat((confidence * 100).toFixed(1)),
      trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      trendStrength: Math.abs(slope),
      historicalMonths: sortedMonths,
      historicalAmounts: amounts
    };
  } catch (error) {
    console.error('Prediction error:', error);
    return {
      predictions: {},
      totalPrediction: 0,
      confidence: 0,
      error: error.message
    };
  }
};

module.exports = {
  predictNextMonth
};
