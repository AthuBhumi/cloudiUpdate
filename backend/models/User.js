const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free'
  },
  planExpiry: {
    type: Date,
    default: null
  },
  apiCallsUsed: {
    type: Number,
    default: 0
  },
  storageUsed: {
    type: Number,
    default: 0 // in bytes
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get plan limits
userSchema.methods.getPlanLimits = function() {
  const limits = {
    free: { apiCalls: 1000, storage: 100 * 1024 * 1024, projects: 2 }, // 100MB
    starter: { apiCalls: 10000, storage: 1 * 1024 * 1024 * 1024, projects: 5 }, // 1GB
    pro: { apiCalls: 100000, storage: 10 * 1024 * 1024 * 1024, projects: 20 }, // 10GB
    enterprise: { apiCalls: 1000000, storage: 100 * 1024 * 1024 * 1024, projects: -1 } // 100GB, unlimited projects
  };
  return limits[this.plan] || limits.free;
};

// Check if user has exceeded limits
userSchema.methods.hasExceededLimits = function() {
  const limits = this.getPlanLimits();
  return {
    apiCalls: this.apiCallsUsed >= limits.apiCalls,
    storage: this.storageUsed >= limits.storage
  };
};

module.exports = mongoose.model('User', userSchema);
