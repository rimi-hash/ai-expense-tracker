/**
 * Expense Model
 * Defines the schema for user expenses with AI categorization
 */

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },

    // Expense Details
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 500
    },
    
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },

    // Categories
    category: {
      type: String,
      enum: [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Healthcare',
        'Education',
        'Travel',
        'Business',
        'Personal Care',
        'Fitness',
        'Groceries',
        'Other'
      ],
      default: 'Other'
    },

    // AI-generated category (from NLP analysis)
    aiCategory: {
      type: String,
      default: null
    },

    // Confidence score of AI categorization (0-1)
    categoryConfidence: {
      type: Number,
      default: null,
      min: 0,
      max: 1
    },

    // Tags for advanced filtering
    tags: {
      type: [String],
      default: []
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Credit Card'
    },

    // Anomaly detection
    isAnomalous: {
      type: Boolean,
      default: false
    },
    anomalyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    anomalyReason: {
      type: String,
      default: null
    },

    // Notes by user
    notes: {
      type: String,
      maxlength: 1000,
      default: null
    },

    // Receipt URL (optional)
    receiptUrl: {
      type: String,
      default: null
    },

    // Status
    isCategorized: {
      type: Boolean,
      default: false
    },

    // Timestamps
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
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
