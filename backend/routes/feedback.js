
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Feedback = require('../models/Feedback');
const Image = require('../models/Image');
const { authenticate, isAdmin } = require('../middleware/auth');

// @route   POST api/feedback
// @desc    Submit feedback
// @access  Private
router.post(
  '/',
  [
    authenticate,
    body('imageId', 'Image ID is required').not().isEmpty(),
    body('text', 'Feedback text is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { imageId, text } = req.body;

    try {
      // Check if image exists
      const image = await Image.findById(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Create new feedback
      const feedback = new Feedback({
        user: req.user.id,
        image: imageId,
        text,
      });

      // Save feedback
      await feedback.save();

      res.json(feedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET api/feedback
// @desc    Get all feedback
// @access  Private (Admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .populate({
        path: 'image',
        populate: { path: 'classification' },
      })
      .sort({ date: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/feedback/user
// @desc    Get feedback by current user
// @access  Private
router.get('/user', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id })
      .populate({
        path: 'image',
        populate: { path: 'classification' },
      })
      .populate('user', 'name')
      .sort({ date: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/feedback/image/:imageId
// @desc    Get feedback for a specific image
// @access  Private (User who owns the image or admin)
router.get('/image/:imageId', authenticate, async (req, res) => {
  try {
    // Check if image exists and user is authorized to view it
    const image = await Image.findById(req.params.imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (image.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this feedback' });
    }

    const feedback = await Feedback.find({ image: req.params.imageId })
      .populate('user', 'name')
      .sort({ date: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/feedback/:id/status
// @desc    Update feedback status
// @access  Private (Admin only)
router.put(
  '/:id/status',
  [
    authenticate,
    isAdmin,
    body('status', 'Status must be pending, approved, or rejected').isIn(['pending', 'approved', 'rejected']),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    try {
      // Find feedback by ID
      let feedback = await Feedback.findById(req.params.id);

      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }

      // Update status
      feedback.status = status;
      await feedback.save();

      res.json(feedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/feedback/:id
// @desc    Delete feedback
// @access  Private (Admin or user who created the feedback)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user is authorized to delete
    if (feedback.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    // Delete feedback
    await feedback.remove();

    res.json({ message: 'Feedback removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/feedback/recent
// @desc    Get recent feedback for public display
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    // Fetch recent approved feedback (limit to 6)
    const feedback = await Feedback.find({ status: 'approved' })
      .populate('user', 'name')
      .populate({
        path: 'image',
        populate: { path: 'classification' },
      })
      .sort({ date: -1 })
      .limit(6);

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// @route   GET api/feedback/public
// @desc    Get all approved feedback for public display
// @access  Public
router.get('/public', async (req, res) => {
  try {
    // Fetch all approved feedback
    const feedback = await Feedback.find({ status: 'approved' })
      .populate('user', 'name')
      .populate({
        path: 'image',
        populate: { path: 'classification' },
      })
      .sort({ date: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});