/**
 * Insight Model
 * Stores pre-computed insights and analytics for users
 */

const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Time period
    month: {
      type: String, // Format: YYYY-MM
      required: true
    },
    year: {
      type: Number,
      required: true
    },

    // Spending Summary
    totalSpent: {
      type: Number,
      default: 0
    },
    
    totalIncome: {
      type: Number,
      default: 0
    },

    // Category Breakdown
    categoryBreakdown: {
      type: Map,
      of: {
        amount: Number,
        percentage: Number,
        count: Number
      },
      default: new Map()
    },

    // Predictions
    predictedNextMonth: {
      type: Number,
      default: 0
    },

    // Anomalies
    anomalies: [{
      expenseId: mongoose.Schema.Types.ObjectId,
      description: String,
      amount: Number,
      anomalyScore: Number,
      reason: String
    }],
    
    anomalyCount: {
      type: Number,
      default: 0
    },

    // AI-Generated Insights
    insights: {
      summary: String,
      recommendations: [String],
      highestCategory: String,
      lowestExpenseDay: Number,
      highestExpenseDay: Number,
      savingsOpportunity: String
    },

    // Comparison with previous month
    monthOverMonthChange: {
      type: Number,
      default: 0
    },

    // Daily breakdown
    dailyAverage: {
      type: Number,
      default: 0
    },

    // Status
    isProcessed: {
      type: Boolean,
      default: false
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
insightSchema.index({ userId: 1, month: -1 });

module.exports = mongoose.model('Insight', insightSchema);
