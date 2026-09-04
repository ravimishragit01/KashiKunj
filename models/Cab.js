const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Swift Dzire, Ertiga, Innova Crysta
  type: { type: String, required: true }, // Airport Drop, Full Day, Outstation
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  seats: { type: Number, default: 4 },
  image: String,
  description: String,
  rating: { type: Number, default: 4.8 },
  highlights: [String], // bullet points shown on the detail page
}, { timestamps: true });

module.exports = mongoose.model('Cab', cabSchema);
