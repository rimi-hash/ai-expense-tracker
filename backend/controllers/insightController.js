/**
 * Insights Controller
 * Handles analytics and insights endpoints
 */

const Expense = require('../models/Expense');
const Insight = require('../models/Insight');
const { generateInsights } = require('../utils/insightGenerator');
const { detectAnomalies } = require('../utils/anomalyDetector');

/**
 * Get monthly insights
 * GET /api/insights/monthly?month=YYYY-MM
 */
const getMonthlyInsights = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      const now = new Date();
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    let insight = await Insight.findOne({
      userId: req.userId,
      month
    });

    if (!insight) {
      // Generate new insights
      const insightData = await generateInsights(req.userId, month);
      const [year, monthNum] = month.split('-');

      insight = new Insight({
        userId: req.userId,
        month,
        year: parseInt(year),
        ...insightData,
        isProcessed: true
      });

      await insight.save();
    }

    res.json({
      success: true,
      insight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get category breakdown
 * GET /api/insights/categories?month=YYYY-MM
 */
const getCategoryBreakdown = async (req, res) => {
  try {
    const { month } = req.query;

    let query = { userId: req.userId };

    if (month) {
      const [year, monthNum] = month.split('-');
      const start = new Date(year, parseInt(monthNum) - 1, 1);
      const end = new Date(year, parseInt(monthNum), 0);
      query.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(query);

    const breakdown = {};
    let total = 0;

    expenses.forEach(expense => {
      const cat = expense.category;
      if (!breakdown[cat]) {
        breakdown[cat] = { amount: 0, count: 0 };
      }
      breakdown[cat].amount += expense.amount;
      breakdown[cat].count += 1;
      total += expense.amount;
    });

    // Add percentages
    Object.keys(breakdown).forEach(cat => {
      breakdown[cat].percentage = ((breakdown[cat].amount / total) * 100).toFixed(2);
    });

    res.json({
      success: true,
      total,
      breakdown
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get anomalies
 * GET /api/insights/anomalies?month=YYYY-MM
 */
const getAnomalies = async (req, res) => {
  try {
    const anomalies = await detectAnomalies(req.userId);

    res.json({
      success: true,
      count: anomalies.length,
      anomalies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get spending trend
 * GET /api/insights/trend?months=6
 */
const getSpendingTrend = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    const trend = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const expenses = await Expense.find({
        userId: req.userId,
        date: { $gte: startDate, $lte: endDate }
      });

      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      trend.push({ month, amount: total });
    }

    res.json({
      success: true,
      trend
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMonthlyInsights,
  getCategoryBreakdown,
  getAnomalies,
  getSpendingTrend
};
