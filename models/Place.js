const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    short: { 
      type: String 
    },
    distance: { 
      type: String 
    },
    highlights: [
      { 
        type: String 
      }
    ],
    order: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', placeSchema);