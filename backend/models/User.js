/**
 * User Model
 * Defines the schema for user authentication and profile data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Please provide a name']
    },
    
    // Profile
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    
    // Settings
    currency: {
      type: String,
      default: 'INR'
    },
    monthlyBudget: {
      type: Number,
      default: 5000
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function() {
  const { password, ...user } = this.toObject();
  return user;
};

module.exports = mongoose.model('User', userSchema);
