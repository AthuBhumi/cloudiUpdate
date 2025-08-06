const express = require('express');
const { body, validationResult } = require('express-validator');
const ApiKey = require('../models/ApiKey');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/keys
// @desc    Get all API keys for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get user's projects
    const projects = await Project.find({
      $or: [
        { owner: req.user.userId },
        { 'collaborators.user': req.user.userId }
      ]
    }).select('_id');

    const projectIds = projects.map(p => p._id);

    const apiKeys = await ApiKey.find({
      project: { $in: projectIds },
      status: { $ne: 'revoked' }
    })
    .populate('project', 'name')
    .select('-hashedKey') // Don't send hashed key
    .sort({ createdAt: -1 });

    res.json({ apiKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/keys
// @desc    Create new API key
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('API key name must be between 2-50 characters'),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('permissions').isArray().withMessage('Permissions must be an array'),
  body('environment').optional().isIn(['development', 'staging', 'production']).withMessage('Invalid environment')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, projectId, permissions, environment = 'development', restrictions } = req.body;

    // Check if project exists and user has permission
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.hasPermission(req.user.userId, 'editor')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate permissions
    const validPermissions = [
      'auth.read', 'auth.write',
      'database.read', 'database.write', 'database.delete',
      'storage.read', 'storage.write', 'storage.delete',
      'analytics.read',
      'functions.invoke',
      'all'
    ];

    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return res.status(400).json({ 
        error: `Invalid permissions: ${invalidPermissions.join(', ')}` 
      });
    }

    const apiKey = new ApiKey({
      name,
      project: projectId,
      owner: req.user.userId,
      permissions,
      environment,
      restrictions: restrictions || {}
    });

    await apiKey.save();
    await apiKey.populate('project', 'name');

    res.status(201).json({
      message: 'API key created successfully',
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        key: apiKey.key, // Show the key only once during creation
        project: apiKey.project,
        permissions: apiKey.permissions,
        environment: apiKey.environment,
        restrictions: apiKey.restrictions,
        status: apiKey.status,
        createdAt: apiKey.createdAt
      }
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/keys/:id
// @desc    Get API key by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id)
      .populate('project', 'name')
      .select('-hashedKey -key'); // Don't send the actual key or hash

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Check if user has permission to view this API key
    const project = await Project.findById(apiKey.project._id);
    if (!project.hasPermission(req.user.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ apiKey });
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/keys/:id
// @desc    Update API key
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('API key name must be between 2-50 characters'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const apiKey = await ApiKey.findById(req.params.id).populate('project');

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Check if user has permission to edit this API key
    const project = await Project.findById(apiKey.project._id);
    if (!project.hasPermission(req.user.userId, 'editor')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, permissions, restrictions } = req.body;

    if (name) apiKey.name = name;
    if (permissions) {
      // Validate permissions
      const validPermissions = [
        'auth.read', 'auth.write',
        'database.read', 'database.write', 'database.delete',
        'storage.read', 'storage.write', 'storage.delete',
        'analytics.read',
        'functions.invoke',
        'all'
      ];

      const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
      if (invalidPermissions.length > 0) {
        return res.status(400).json({ 
          error: `Invalid permissions: ${invalidPermissions.join(', ')}` 
        });
      }
      apiKey.permissions = permissions;
    }
    if (restrictions) apiKey.restrictions = { ...apiKey.restrictions, ...restrictions };

    await apiKey.save();

    res.json({
      message: 'API key updated successfully',
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        project: apiKey.project,
        permissions: apiKey.permissions,
        restrictions: apiKey.restrictions,
        status: apiKey.status,
        updatedAt: apiKey.updatedAt
      }
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/keys/:id/rotate
// @desc    Rotate API key
// @access  Private
router.post('/:id/rotate', auth, async (req, res) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id).populate('project');

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Check if user has permission to rotate this API key
    const project = await Project.findById(apiKey.project._id);
    if (!project.hasPermission(req.user.userId, 'editor')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { oldKey, newKey } = await apiKey.rotate();

    res.json({
      message: 'API key rotated successfully',
      newKey,
      oldKey: oldKey.substring(0, 12) + '...' // Show only partial old key for reference
    });
  } catch (error) {
    console.error('Rotate API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/keys/:id
// @desc    Revoke API key
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id).populate('project');

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Check if user has permission to revoke this API key
    const project = await Project.findById(apiKey.project._id);
    if (!project.hasPermission(req.user.userId, 'editor')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    apiKey.status = 'revoked';
    await apiKey.save();

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
