/**
 * Chat History Model
 * Stores user chat interactions with the AI
 */

const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    messages: [{
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],

    // Summary of the conversation
    summary: String,

    // Related expenses (if any)
    relatedExpenses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense'
    }],

    // Session info
    isActive: {
      type: Boolean,
      default: true
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

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
