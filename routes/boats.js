const router = require('express').Router();
const Boat = require('../models/Boat');

router.get('/', async (req, res) => {
  const boats = await Boat.find();
  res.json(boats);
});

router.get('/:id', async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) return res.status(404).json({ error: 'Boat not found' });
  res.json(boat);
});

router.post('/', async (req, res) => {
  const boat = await Boat.create(req.body);
  res.status(201).json(boat);
});

router.put('/:id', async (req, res) => {
  const boat = await Boat.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(boat);
});

router.delete('/:id', async (req, res) => {
  await Boat.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
