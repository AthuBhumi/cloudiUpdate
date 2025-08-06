const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [50, 'Project name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  projectId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  settings: {
    allowPublicAccess: {
      type: Boolean,
      default: false
    },
    enableAnalytics: {
      type: Boolean,
      default: true
    },
    enableRateLimit: {
      type: Boolean,
      default: true
    },
    maxRequestsPerMinute: {
      type: Number,
      default: 100
    }
  },
  usage: {
    totalApiCalls: {
      type: Number,
      default: 0
    },
    totalStorageUsed: {
      type: Number,
      default: 0
    },
    lastApiCall: {
      type: Date,
      default: null
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'development'
  }
}, {
  timestamps: true
});

// Generate unique project ID
projectSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  const generateId = () => {
    return 'proj_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  let projectId = generateId();
  let exists = await this.constructor.findOne({ projectId });
  
  while (exists) {
    projectId = generateId();
    exists = await this.constructor.findOne({ projectId });
  }
  
  this.projectId = projectId;
  next();
});

// Check if user has permission
projectSchema.methods.hasPermission = function(userId, requiredRole = 'viewer') {
  // Owner has all permissions
  if (this.owner.toString() === userId.toString()) {
    return true;
  }
  
  // Check collaborators
  const collaborator = this.collaborators.find(c => c.user.toString() === userId.toString());
  if (!collaborator) return false;
  
  const roleHierarchy = { viewer: 1, editor: 2, admin: 3 };
  return roleHierarchy[collaborator.role] >= roleHierarchy[requiredRole];
};

module.exports = mongoose.model('Project', projectSchema);
