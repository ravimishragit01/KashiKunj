const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  badge: {
    type: String,
    default: 'Special Offer',
    trim: true
  },
  targetLink: {
    type: String,
    default: '#contact'
  },
  buttonText: {
    type: String,
    default: 'Claim Offer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ad', AdSchema);