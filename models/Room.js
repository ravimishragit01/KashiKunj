const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Deluxe, Super Deluxe, Suite
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  capacity: { type: Number, default: 2 },
  amenities: [String], // WiFi, AC, Parking, Geyser, TV
  images: [String],
  description: String,
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8 },
  highlights: [String], // bullet points shown on the detail page
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
