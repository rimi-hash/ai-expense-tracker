/**
 * Insights Generator Utility
 * Generates AI-powered insights and recommendations
 */

const Expense = require('../models/Expense');
const axios = require('axios');

/**
 * Generate insights from spending data
 */
const generateInsights = async (userId, month) => {
  try {
    // Parse month string (YYYY-MM)
    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, parseInt(monthNum) - 1, 1);
    const endDate = new Date(year, parseInt(monthNum), 0);

    // Get expenses for the month
    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (expenses.length === 0) {
      return {
        summary: 'No expenses recorded this month.',
        recommendations: [],
        highestCategory: null,
        savingsOpportunity: null
      };
    }

    // Calculate statistics
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = {};
    
    expenses.forEach(expense => {
      const cat = expense.category;
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { amount: 0, count: 0 };
      }
      categoryBreakdown[cat].amount += expense.amount;
      categoryBreakdown[cat].count += 1;
    });

    // Find highest category
    const highestCategory = Object.keys(categoryBreakdown).reduce((a, b) =>
      categoryBreakdown[a].amount > categoryBreakdown[b].amount ? a : b
    );

    // Generate recommendations
    const recommendations = generateRecommendations(categoryBreakdown, total);

    // Create summary
    const summary = `You spent $${total.toFixed(2)} this month across ${expenses.length} transactions. 
    Your highest spending category is ${highestCategory} at $${categoryBreakdown[highestCategory].amount.toFixed(2)} (${((categoryBreakdown[highestCategory].amount/total)*100).toFixed(1)}%).`;

    // Calculate savings opportunity
    const avgDaily = total / new Date(year, parseInt(monthNum), 0).getDate();
    const savingsOpportunity = `By reducing ${highestCategory} spending by 10%, you could save $${(categoryBreakdown[highestCategory].amount * 0.1).toFixed(2)} per month.`;

    return {
      summary,
      recommendations,
      highestCategory,
      savingsOpportunity,
      totalSpent: total,
      categoryBreakdown
    };
  } catch (error) {
    console.error('Insights generation error:', error);
    return {
      summary: 'Unable to generate insights.',
      recommendations: [],
      highestCategory: null,
      savingsOpportunity: null
    };
  }
};

/**
 * Generate recommendations based on spending patterns
 */
const generateRecommendations = (categoryBreakdown, total) => {
  const recommendations = [];

  // Check for high categories
  Object.entries(categoryBreakdown).forEach(([category, data]) => {
    const percentage = (data.amount / total) * 100;
    
    if (category === 'Food & Dining' && percentage > 30) {
      recommendations.push('Consider meal planning - your Food & Dining expenses are high.');
    }
    if (category === 'Shopping' && percentage > 20) {
      recommendations.push('Try to reduce impulsive shopping - set a budget for this category.');
    }
    if (category === 'Transportation' && percentage > 20) {
      recommendations.push('Look into public transport or carpooling to reduce transportation costs.');
    }
    if (category === 'Entertainment' && percentage > 15) {
      recommendations.push('Consider free or low-cost entertainment alternatives.');
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Your spending appears well-distributed. Keep monitoring your budget!');
  }

  return recommendations;
};

module.exports = {
  generateInsights
};
