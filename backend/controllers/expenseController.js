/**
 * Expense Controller
 * Handles CRUD operations for expenses
 */

const Expense = require('../models/Expense');
const { categorizeWithAI, categorizeByHeuristics } = require('../utils/categorizer');
const { detectAnomalies } = require('../utils/anomalyDetector');

/**
 * Get all expenses for user
 * GET /api/expenses?month=YYYY-MM&category=...
 */
const getExpenses = async (req, res) => {
  try {
    const { month, category, startDate, endDate } = req.query;
    const query = { userId: req.userId };

    // Filter by month (YYYY-MM)
    if (month) {
      const [year, monthNum] = month.split('-');
      const start = new Date(year, parseInt(monthNum) - 1, 1);
      const end = new Date(year, parseInt(monthNum), 0);
      query.date = { $gte: start, $lte: end };
    }

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: expenses.length,
      expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get single expense
 * GET /api/expenses/:id
 */
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create new expense
 * POST /api/expenses
 */
const createExpense = async (req, res) => {
  try {
    const { amount, description, date, category, paymentMethod, notes } = req.body;

    // Validation
    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Amount and description are required'
      });
    }

    // Create expense object
    const expenseData = {
      userId: req.userId,
      amount,
      description,
      date: date ? new Date(date) : new Date(),
      category: category || 'Other',
      paymentMethod: paymentMethod || 'Credit Card',
      notes
    };

    // AI Categorization
    const categorization = await categorizeWithAI(description);
    expenseData.aiCategory = categorization.category;
    expenseData.categoryConfidence = categorization.confidence;
    expenseData.isCategorized = true;

    // Create and save
    const expense = new Expense(expenseData);
    await expense.save();

    // Detect anomalies
    const anomalies = await detectAnomalies(req.userId);
    const isAnomalous = anomalies.some(a => a.expenseId.toString() === expense._id.toString());
    
    if (isAnomalous) {
      expense.isAnomalous = true;
      const anomaly = anomalies.find(a => a.expenseId.toString() === expense._id.toString());
      expense.anomalyScore = anomaly.anomalyScore;
      expense.anomalyReason = anomaly.reason;
      await expense.save();
    }

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update expense
 * PUT /api/expenses/:id
 */
const updateExpense = async (req, res) => {
  try {
    const { amount, description, category, paymentMethod, notes, date } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Update fields
    if (amount) expense.amount = amount;
    if (description) {
      expense.description = description;
      // Re-categorize if description changed
      const categorization = await categorizeWithAI(description);
      expense.aiCategory = categorization.category;
      expense.categoryConfidence = categorization.confidence;
    }
    if (category) expense.category = category;
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (notes) expense.notes = notes;
    if (date) expense.date = new Date(date);

    await expense.save();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete expense
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense
};
