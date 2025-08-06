const mongoose = require('mongoose');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'API key name is required'],
    trim: true,
    maxlength: [50, 'API key name cannot be more than 50 characters']
  },
  key: {
    type: String,
    unique: true,
    required: true
  },
  hashedKey: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      'auth.read', 'auth.write',
      'database.read', 'database.write', 'database.delete',
      'storage.read', 'storage.write', 'storage.delete',
      'analytics.read',
      'functions.invoke',
      'all'
    ]
  }],
  restrictions: {
    allowedOrigins: [{
      type: String,
      trim: true
    }],
    allowedIPs: [{
      type: String,
      trim: true
    }],
    rateLimit: {
      requestsPerMinute: {
        type: Number,
        default: 100
      },
      requestsPerHour: {
        type: Number,
        default: 1000
      },
      requestsPerDay: {
        type: Number,
        default: 10000
      }
    }
  },
  usage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    lastUsed: {
      type: Date,
      default: null
    },
    requestsToday: {
      type: Number,
      default: 0
    },
    requestsThisMonth: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: null // null means never expires
  },
  lastRotated: {
    type: Date,
    default: Date.now
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'development'
  }
}, {
  timestamps: true
});

// Generate API key before saving
apiKeySchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  // Generate a unique API key
  const generateKey = () => {
    const prefix = this.environment === 'production' ? 'pk_live_' : 'pk_test_';
    const randomPart = crypto.randomBytes(32).toString('hex');
    return prefix + randomPart;
  };
  
  let apiKey = generateKey();
  let exists = await this.constructor.findOne({ key: apiKey });
  
  while (exists) {
    apiKey = generateKey();
    exists = await this.constructor.findOne({ key: apiKey });
  }
  
  this.key = apiKey;
  this.hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  next();
});

// Method to rotate API key
apiKeySchema.methods.rotate = async function() {
  const oldKey = this.key;
  
  const generateKey = () => {
    const prefix = this.environment === 'production' ? 'pk_live_' : 'pk_test_';
    const randomPart = crypto.randomBytes(32).toString('hex');
    return prefix + randomPart;
  };
  
  let newKey = generateKey();
  let exists = await this.constructor.findOne({ key: newKey });
  
  while (exists) {
    newKey = generateKey();
    exists = await this.constructor.findOne({ key: newKey });
  }
  
  this.key = newKey;
  this.hashedKey = crypto.createHash('sha256').update(newKey).digest('hex');
  this.lastRotated = new Date();
  
  await this.save();
  return { oldKey, newKey };
};

// Method to check if key has permission
apiKeySchema.methods.hasPermission = function(permission) {
  return this.permissions.includes('all') || this.permissions.includes(permission);
};

// Method to check rate limits
apiKeySchema.methods.checkRateLimit = function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Reset daily counter if it's a new day
  if (!this.usage.lastUsed || this.usage.lastUsed < today) {
    this.usage.requestsToday = 0;
  }
  
  return {
    canMakeRequest: this.usage.requestsToday < this.restrictions.rateLimit.requestsPerDay,
    remainingRequests: Math.max(0, this.restrictions.rateLimit.requestsPerDay - this.usage.requestsToday)
  };
};

// Method to increment usage
apiKeySchema.methods.incrementUsage = async function() {
  this.usage.totalRequests += 1;
  this.usage.requestsToday += 1;
  this.usage.requestsThisMonth += 1;
  this.usage.lastUsed = new Date();
  await this.save();
};

module.exports = mongoose.model('ApiKey', apiKeySchema);
