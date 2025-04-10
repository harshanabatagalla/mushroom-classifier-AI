
const mongoose = require('mongoose');

const ClassificationSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true,
  },
  classification: {
    type: String,
    enum: ['conditionally_edible', 'deadly', 'edible', 'poisonous', 'not_a_mushroom'],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  details: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Classification', ClassificationSchema);
