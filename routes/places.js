const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// GET /api/places - Return active places sorted by display order
router.get('/', async (req, res) => {
  try {
    const places = await Place.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(places);
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).json({ error: 'Failed to retrieve places' });
  }
});

// GET /api/places/:slug - Return single place detail
router.get('/:slug', async (req, res) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug, isActive: true });
    if (!place) {
      return res.status(4404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    console.error('Error fetching place by slug:', err);
    res.status(500).json({ error: 'Failed to retrieve place detail' });
  }
});

module.exports = router;