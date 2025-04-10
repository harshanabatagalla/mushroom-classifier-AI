
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

  // Temporary file path for the downloaded image
  let tempFilePath = null;

  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if image belongs to user
    if (image.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to analyze this image' });
    }

    // Create temp file path with a random name to avoid conflicts
    const tempFileName = `temp_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    tempFilePath = path.join(__dirname, '../uploads', tempFileName);

    // Download the image from Cloudinary using a stream
    const https = require('https');
    const file = fs.createWriteStream(tempFilePath);

    // Create a promise to wait for download completion
    await new Promise((resolve, reject) => {
      https.get(image.url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve); // Close the file and resolve the promise
        });
      }).on('error', (err) => {
        fs.unlink(tempFilePath, () => { }); // Delete temp file on error
        reject(err);
      });
    });

    // Verify Python script exists
    const scriptPath = path.join(__dirname, '../utils/predict.py');
    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({ message: 'Classification script not found' });
    }

    // Spawn Python classification process with the local file path
    const pythonProcess = spawn('python', [scriptPath, tempFilePath]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      // Always clean up the temp file
      if (tempFilePath) {
        cleanupFile(tempFilePath);
        tempFilePath = null;
      }

      // Handle non-zero exit code
      if (code !== 0) {
        return res.status(500).json({
          message: 'Classification process failed',
          error: errorOutput || 'No specific error message from Python process'
        });
      }

      // Log the raw output for debugging
      console.log('Raw Python output:', output);

      // Remove extra log data (everything before the JSON string)
      const jsonMatch = output.match(/{.*}/s); // Added 's' flag to match across multiple lines
      if (!jsonMatch) {
        return res.status(500).json({
          message: 'Failed to parse classification result',
          error: 'No valid JSON found in Python output',
          rawOutput: output // Return raw output for debugging
        });
      }

      // Parse the JSON part of the output
      try {
        const result = JSON.parse(jsonMatch[0].trim());

        // Map new format to old format for compatibility
        let className = result.classification || 'unknown';
        let confidence = result.confidence || '0.00%';
        
        // Determine if edible based on class name
        const isEdible = className.toLowerCase().includes('edible');
        const isPoisonous = className.toLowerCase().includes('poisonous');
        
        // Handle case when the image is not a mushroom
        let classification;
        if (!result.is_mushroom) {
          classification = {
            image: image._id,
            classification: 'not_a_mushroom',
            confidence: confidence,
            details: 'The image does not appear to be a mushroom or is not clearly identifiable.'
          };
        } else {
          classification = {
            image: image._id,
            classification: className.toLowerCase(),
            confidence: confidence,
            details: result.details || (isEdible
              ? 'This mushroom appears to be from an edible variety, though always consult an expert before consumption.'
              : isPoisonous
                ? 'This mushroom appears to have characteristics consistent with poisonous varieties. Do not consume.'
                : 'This mushroom type has been identified. Always consult an expert before handling or consuming any wild mushroom.'),
          };
        }

        // Create and save classification
        const classificationDoc = new Classification(classification);
        await classificationDoc.save();

        // Update image with classification and mark as analyzed
        image.classification = classificationDoc._id;
        image.analyzed = true;
        await image.save();

        // Return the classification results
        res.json(classificationDoc);
      } catch (parseError) {
        res.status(500).json({
          message: 'Failed to parse classification result',
          error: parseError.message,
          rawOutput: output // Return raw output for debugging
        });
      }
    });

    // Handle spawning errors
    pythonProcess.on('error', (spawnError) => {
      // Clean up the temp file
      if (tempFilePath) {
        cleanupFile(tempFilePath);
        tempFilePath = null;
      }

      res.status(500).json({
        message: 'Failed to spawn classification process',
        error: spawnError.message
      });
    });

  } catch (err) {
    // Clean up the temp file if there was an error
    if (tempFilePath) {
      cleanupFile(tempFilePath);
    }

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
