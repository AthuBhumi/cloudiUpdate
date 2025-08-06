const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  }
});

// @route   POST /api/storage/upload
// @desc    Upload file to Cloudinary
// @access  Private
router.post('/upload', [auth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check user's storage limits
    const limits = req.userDoc.getPlanLimits();
    if (req.userDoc.storageUsed + req.file.size > limits.storage) {
      return res.status(400).json({ 
        error: `Storage limit exceeded. You have ${((limits.storage - req.userDoc.storageUsed) / 1024 / 1024).toFixed(2)}MB remaining.` 
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `cloudidada/${req.user.userId}`,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update user's storage usage
    req.userDoc.storageUsed += req.file.size;
    await req.userDoc.save();

    res.json({
      message: 'File uploaded successfully',
      file: {
        id: uploadResult.public_id,
        url: uploadResult.secure_url,
        originalName: req.file.originalname,
        size: req.file.size,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
        uploadedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// @route   GET /api/storage/files
// @desc    Get user's uploaded files
// @access  Private
router.get('/files', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const result = await cloudinary.search
      .expression(`folder:cloudidada/${req.user.userId}`)
      .sort_by([['created_at', 'desc']])
      .max_results(limit)
      .next_cursor(page > 1 ? req.query.cursor : null)
      .execute();

    res.json({
      files: result.resources.map(file => ({
        id: file.public_id,
        url: file.secure_url,
        format: file.format,
        size: file.bytes,
        resourceType: file.resource_type,
        createdAt: file.created_at
      })),
      nextCursor: result.next_cursor,
      totalCount: result.total_count
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// @route   DELETE /api/storage/files/:id
// @desc    Delete file from Cloudinary
// @access  Private
router.delete('/files/:id', auth, async (req, res) => {
  try {
    const publicId = req.params.id;
    
    // Verify the file belongs to the user
    if (!publicId.startsWith(`cloudidada/${req.user.userId}/`)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
