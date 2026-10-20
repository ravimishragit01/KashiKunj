const router = require('express').Router();
const Boat = require('../models/Boat');

router.get('/', async (req, res) => {
  const boats = await Boat.find().sort({ order: 1 });
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

// // ================= NEW ROUTE FOR SEAT SELECTION ================= // not implemented
// router.put('/:id/seats', async (req, res) => {
//   try {
//     const { bookedSeats } = req.body;
//     const boat = await Boat.findByIdAndUpdate(
//       req.params.id, 
//       { bookedSeats }, 
//       { new: true }
//     );
//     res.json(boat);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// ================================================================ //

router.delete('/:id', async (req, res) => {
  await Boat.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;