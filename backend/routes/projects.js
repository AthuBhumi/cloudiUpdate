const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const ApiKey = require('../models/ApiKey');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.userId },
        { 'collaborators.user': req.user.userId }
      ]
    })
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Project name must be between 2-50 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, environment = 'development' } = req.body;

    // Check user's plan limits
    const userProjects = await Project.countDocuments({ owner: req.user.userId, status: 'active' });
    const planLimits = req.userDoc.getPlanLimits();
    
    if (planLimits.projects !== -1 && userProjects >= planLimits.projects) {
      return res.status(400).json({ 
        error: `You have reached the maximum number of projects (${planLimits.projects}) for your ${req.userDoc.plan} plan` 
      });
    }

    const project = new Project({
      name,
      description,
      owner: req.user.userId,
      environment
    });

    await project.save();
    await project.populate('owner', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has permission to view this project
    if (!project.hasPermission(req.user.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Project name must be between 2-50 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has edit permission
    if (!project.hasPermission(req.user.userId, 'editor')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, description, settings, tags } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (settings) project.settings = { ...project.settings, ...settings };
    if (tags) project.tags = tags;

    await project.save();
    await project.populate('owner', 'name email');

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can delete project
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only project owner can delete the project' });
    }

    // Soft delete - mark as deleted
    project.status = 'deleted';
    await project.save();

    // Also revoke all API keys for this project
    await ApiKey.updateMany(
      { project: project._id },
      { status: 'revoked' }
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
