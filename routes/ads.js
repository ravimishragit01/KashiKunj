const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// GET /api/ads - Fetch all active promotions
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error('Error fetching ads:', err);
    res.status(500).json({ error: 'Server error retrieving advertisements' });
  }
});

module.exports = router;