
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const Image = require('../models/Image');
const Classification = require('../models/Classification');
const { authenticate } = require('../middleware/auth');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');

// Helper function to clean up uploads
const cleanupFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting file:', err);
  });
};

// @route   POST api/images/upload
// @desc    Upload an image
// @access  Private
router.post('/upload', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mushroom_safeguard',
    });

    // Create new image in database
    const image = new Image({
      user: req.user.id,
      fileName: req.file.originalname,
      url: result.secure_url,
      cloudinaryId: result.public_id,
    });

    // Save image to database
    await image.save();

    // Clean up local file
    cleanupFile(req.file.path);

    res.json(image);
  } catch (err) {
    console.error(err);
    
    // Clean up local file if exists
    if (req.file) {
      cleanupFile(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error during image upload' });
  }
});

// @route   POST api/images/analyze/:id
// @desc    Analyze an image
// @access  Private
router.post('/analyze/:id', authenticate, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if image belongs to user
    if (image.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to analyze this image' });
    }

    // For demonstration purposes: Simulate AI classification
    // In a real app, you'd integrate with an actual AI service
    const isEdible = Math.random() > 0.5;
    const confidence = 0.5 + (Math.random() * 0.5); // Between 0.5 and 1.0
    
    // Create classification
    const classification = new Classification({
      image: image._id,
      classification: isEdible ? 'edible' : 'poisonous',
      confidence,
      details: isEdible 
        ? 'This mushroom appears to be from an edible variety, though always consult an expert before consumption.'
        : 'This mushroom appears to have characteristics consistent with poisonous varieties. Do not consume.',
    });
    
    // Save classification
    await classification.save();
    
    // Update image with classification and mark as analyzed
    image.classification = classification._id;
    image.analyzed = true;
    await image.save();
    
    res.json(classification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during image analysis' });
  }
});

// @route   GET api/images
// @desc    Get all images for current user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    // Find images for current user or all images for admin
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    
    const images = await Image.find(query)
      .populate('classification')
      .sort({ uploadDate: -1 });
    
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/images/:id
// @desc    Get a specific image
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('classification')
      .populate('user', 'name');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if image belongs to user
    if (image.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this image' });
    }
    
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/images/:id
// @desc    Delete an image
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if image belongs to user
    if (image.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);
    
    // Delete classification if exists
    if (image.classification) {
      await Classification.findByIdAndDelete(image.classification);
    }
    
    // Delete image from database
    await image.remove();
    
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
