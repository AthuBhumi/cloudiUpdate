const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.userDoc._id,
        name: req.userDoc.name,
        email: req.userDoc.email,
        role: req.userDoc.role,
        plan: req.userDoc.plan,
        isEmailVerified: req.userDoc.isEmailVerified,
        avatar: req.userDoc.avatar,
        apiCallsUsed: req.userDoc.apiCallsUsed,
        storageUsed: req.userDoc.storageUsed,
        lastLogin: req.userDoc.lastLogin,
        planLimits: req.userDoc.getPlanLimits(),
        preferences: req.userDoc.preferences
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
