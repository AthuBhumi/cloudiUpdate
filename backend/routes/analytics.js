const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    // Mock analytics data
    const analytics = {
      totalApiCalls: req.userDoc.apiCallsUsed,
      storageUsed: req.userDoc.storageUsed,
      planLimits: req.userDoc.getPlanLimits(),
      recentActivity: [
        {
          type: 'api_call',
          endpoint: '/api/database/users',
          timestamp: new Date(),
          status: 'success'
        },
        {
          type: 'file_upload',
          fileName: 'profile.jpg',
          timestamp: new Date(),
          status: 'success'
        }
      ],
      dailyStats: {
        apiCalls: [120, 150, 89, 200, 180, 145, 160],
        storage: [1.2, 1.3, 1.5, 1.8, 2.1, 2.3, 2.5], // GB
        errors: [2, 1, 0, 3, 1, 0, 1]
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/usage
// @desc    Get detailed usage analytics
// @access  Private
router.get('/usage', auth, async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // Mock usage data based on time range
    const usage = {
      timeRange,
      apiCalls: {
        total: req.userDoc.apiCallsUsed,
        byEndpoint: [
          { endpoint: '/api/auth/login', count: 45 },
          { endpoint: '/api/database/users', count: 120 },
          { endpoint: '/api/storage/upload', count: 25 }
        ]
      },
      storage: {
        total: req.userDoc.storageUsed,
        byType: [
          { type: 'images', size: 1500000, count: 15 },
          { type: 'documents', size: 500000, count: 8 },
          { type: 'videos', size: 3000000, count: 3 }
        ]
      },
      errors: {
        total: 5,
        byType: [
          { type: '4xx', count: 3 },
          { type: '5xx', count: 2 }
        ]
      }
    };

    res.json(usage);
  } catch (error) {
    console.error('Get usage analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
