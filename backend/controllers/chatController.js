/**
 * Chat Controller
 * Handles natural language queries about expenses
 */

const ChatHistory = require('../models/ChatHistory');
const Expense = require('../models/Expense');
const axios = require('axios');

/**
 * Process chat query
 * POST /api/chat
 */
const processChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user's expenses for context
    const expenses = await Expense.find({ userId: req.userId }).limit(100);

    // Generate AI response based on message and expenses
    const response = await generateChatResponse(message, expenses);

    // Save to chat history
    let chatHistory = await ChatHistory.findById(conversationId);

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.userId,
        messages: []
      });
    }

    chatHistory.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    );

    await chatHistory.save();

    res.json({
      success: true,
      response,
      conversationId: chatHistory._id
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get chat history
 * GET /api/chat/history/:conversationId
 */
const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      _id: req.params.conversationId,
      userId: req.userId
    });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      chatHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate AI response to chat query
 * Analyzes user expenses and provides intelligent answers
 */
const generateChatResponse = async (message, expenses) => {
  const lowerMsg = message.toLowerCase();

  // Calculate spending stats
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryStats = {};

  expenses.forEach(expense => {
    if (!categoryStats[expense.category]) {
      categoryStats[expense.category] = 0;
    }
    categoryStats[expense.category] += expense.amount;
  });

  // Answer queries based on keywords
  if (lowerMsg.includes('how much') && lowerMsg.includes('spent')) {
    if (lowerMsg.includes('food')) {
      const foodSpent = categoryStats['Food & Dining'] || 0;
      return `You spent $${foodSpent.toFixed(2)} on Food & Dining.`;
    }
    if (lowerMsg.includes('this month')) {
      return `You spent $${totalSpent.toFixed(2)} this month.`;
    }
    return `Total spending: $${totalSpent.toFixed(2)}`;
  }

  if (lowerMsg.includes('where') && lowerMsg.includes('save')) {
    const topCategory = Object.keys(categoryStats).reduce((a, b) =>
      categoryStats[a] > categoryStats[b] ? a : b
    );
    return `Your highest spending category is ${topCategory} ($${categoryStats[topCategory].toFixed(2)}). Try reducing this by 10% to save money.`;
  }

  if (lowerMsg.includes('breakdown') || lowerMsg.includes('category')) {
    let breakdown = 'Spending by category:\n';
    Object.entries(categoryStats).forEach(([cat, amount]) => {
      breakdown += `${cat}: $${amount.toFixed(2)}\n`;
    });
    return breakdown;
  }

  if (lowerMsg.includes('expensive') || lowerMsg.includes('most') || lowerMsg.includes('highest')) {
    const expensiveExpenses = expenses.sort((a, b) => b.amount - a.amount).slice(0, 3);
    let response = 'Your most expensive transactions:\n';
    expensiveExpenses.forEach(e => {
      response += `${e.description}: $${e.amount}\n`;
    });
    return response;
  }

  if (lowerMsg.includes('budget') || lowerMsg.includes('limit')) {
    if (totalSpent > 3000) {
      return `Your spending ($${totalSpent.toFixed(2)}) is high. Consider setting a monthly limit of $3000.`;
    }
    return `Your spending ($${totalSpent.toFixed(2)}) is within reasonable limits.`;
  }

  // Default response
  return `I found ${expenses.length} transactions totaling $${totalSpent.toFixed(2)}. Ask me about specific categories, your highest expenses, or where to save money!`;
};

module.exports = {
  processChat,
  getChatHistory
};
