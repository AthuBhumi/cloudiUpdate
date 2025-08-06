const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const ApiKey = require('../models/ApiKey');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin middleware
const adminAuth = async (req, res, next) => {
  if (req.userDoc.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/dashboard', [auth, adminAuth], async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      ApiKey.countDocuments({ status: 'active' }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    ]);

    const planDistribution = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers: stats[0],
      activeProjects: stats[1],
      activeApiKeys: stats[2],
      newUsersThisWeek: stats[3],
      planDistribution
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/plan
// @desc    Update user plan
// @access  Private (Admin only)
router.put('/users/:id/plan', [auth, adminAuth], async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['free', 'starter', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { plan, planExpiry: plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User plan updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============= BLOG MANAGEMENT ROUTES =============

// @route   GET /api/admin/blogs
// @desc    Get all blogs for admin
// @access  Private (Admin only)
router.get('/blogs', [auth, adminAuth], async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/blogs
// @desc    Create new blog post
// @access  Private (Admin only)
router.post('/blogs', [auth, adminAuth], async (req, res) => {
  try {
    const { title, content, author, category, tags, published, featured, readTime, image } = req.body;

    const blog = new Blog({
      title,
      content,
      author: author || 'Admin',
      category: category || 'Tutorial',
      tags: tags || [],
      published: published !== undefined ? published : true,
      featured: featured || false,
      readTime: readTime || '5 min read',
      image: image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });

    await blog.save();

    res.status(201).json({
      message: 'Blog post created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/blogs/:id
// @desc    Update blog post
// @access  Private (Admin only)
router.put('/blogs/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { title, content, author, category, tags, published, featured, readTime, image } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        author,
        category,
        tags,
        published,
        featured,
        readTime,
        image
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({
      message: 'Blog post updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete blog post
// @access  Private (Admin only)
router.delete('/blogs/:id', [auth, adminAuth], async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/settings
// @desc    Get application settings
// @access  Private (Admin only)
router.get('/settings', [auth, adminAuth], async (req, res) => {
  try {
    // For now, return default settings. In production, these would be stored in database
    const settings = {
      site: {
        name: process.env.SITE_NAME || 'Cloudidada',
        description: process.env.SITE_DESCRIPTION || 'Cloud infrastructure platform for developers',
        url: process.env.SITE_URL || 'https://cloudidada.com',
        logo: process.env.SITE_LOGO || '',
        timezone: process.env.TIMEZONE || 'UTC'
      },
      smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        username: process.env.SMTP_USERNAME || '',
        password: process.env.SMTP_PASSWORD ? '••••••••' : '', // Mask password
        fromEmail: process.env.SMTP_FROM_EMAIL || '',
        fromName: process.env.SMTP_FROM_NAME || 'Cloudidada'
      },
      api: {
        rateLimit: parseInt(process.env.API_RATE_LIMIT) || 100,
        apiVersion: process.env.API_VERSION || 'v1',
        enableCors: process.env.ENABLE_CORS !== 'false',
        allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173',
        jwtSecret: process.env.JWT_SECRET ? '••••••••' : '' // Mask secret
      }
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update application settings
// @access  Private (Admin only)
router.put('/settings', [auth, adminAuth], async (req, res) => {
  try {
    const { site, smtp, api } = req.body;

    // In a production app, you would save these to a database
    // For now, we'll just validate and return success
    
    // Validate site settings
    if (site) {
      if (site.name && typeof site.name !== 'string') {
        return res.status(400).json({ error: 'Site name must be a string' });
      }
      if (site.description && typeof site.description !== 'string') {
        return res.status(400).json({ error: 'Site description must be a string' });
      }
      if (site.url && typeof site.url !== 'string') {
        return res.status(400).json({ error: 'Site URL must be a string' });
      }
    }

    // Validate SMTP settings
    if (smtp) {
      if (smtp.host && typeof smtp.host !== 'string') {
        return res.status(400).json({ error: 'SMTP host must be a string' });
      }
      if (smtp.port && (typeof smtp.port !== 'number' || smtp.port < 1 || smtp.port > 65535)) {
        return res.status(400).json({ error: 'SMTP port must be a valid port number' });
      }
      if (smtp.username && typeof smtp.username !== 'string') {
        return res.status(400).json({ error: 'SMTP username must be a string' });
      }
    }

    // Validate API settings
    if (api) {
      if (api.rateLimit && (typeof api.rateLimit !== 'number' || api.rateLimit < 1)) {
        return res.status(400).json({ error: 'Rate limit must be a positive number' });
      }
    }

    // In production, save settings to database or environment variables
    console.log('Settings update requested:', { site, smtp, api });

    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      note: 'In production, these settings would be persisted to database/environment'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/test-smtp
// @desc    Test SMTP connection and send test email
// @access  Private (Admin only)
router.post('/test-smtp', [auth, adminAuth], async (req, res) => {
  try {
    const { host, port, secure, username, password, fromName } = req.body;

    // Validate required fields
    if (!host || !port || !username || !password) {
      return res.status(400).json({ 
        error: 'Missing required SMTP configuration: host, port, username, and password are required' 
      });
    }

    // In a real application, you would use nodemailer to test the connection
    const nodemailer = require('nodemailer');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: username,
        pass: password
      }
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    const testEmail = {
      from: `${fromName} <${username}>`,
      to: username, // Send test email to the same address
      subject: 'SMTP Test Email - Cloudidada Admin',
      html: `
        <h2>SMTP Configuration Test</h2>
        <p>This is a test email to verify your SMTP configuration is working correctly.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>Host: ${host}</li>
          <li>Port: ${port}</li>
          <li>Secure: ${secure ? 'Yes' : 'No'}</li>
          <li>Username: ${username}</li>
        </ul>
        <p>If you received this email, your SMTP configuration is working properly!</p>
        <hr>
        <p><small>Sent from Cloudidada Admin Panel</small></p>
      `
    };

    await transporter.sendMail(testEmail);

    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${username}` 
    });

  } catch (error) {
    console.error('SMTP test error:', error);
    
    let errorMessage = 'SMTP connection failed';
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed - check username and password';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'SMTP host not found - check host address';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused - check host and port';
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(400).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

module.exports = router;
