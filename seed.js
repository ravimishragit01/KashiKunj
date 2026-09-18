// Run: node seed.js  -> populates sample rooms, cabs, boats
require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Cab = require('./models/Cab');
const Boat = require('./models/Boat');
const Ad = require('./models/Ad');

// 2. Add sample ad data:
const sampleAds = [
  {
    title: "Sunrise Ganga Aarti + Boat Combo",
    description: "Book an early morning private rowing boat from Assi Ghat with hotel stay and get flat 15% off.",
    imageUrl: '/images/promotions/img1.jpeg',
    badge: "Limited Deal",
    targetLink: "#boats",
    buttonText: "Claim Discount",
    isActive: true
  },
  {
    title: "Stays at The Kashi Kunj - Special Offer",
    description: "Book your stay at The Kashi Kunj and enjoy a complimentary boat ride on the Ganga during your visit.",
    imageUrl: '/images/promotions/img2.jpeg',
    badge: "Best Value",
    targetLink: "#rooms",
    buttonText: "Book Room",
    isActive: true
  },
  {
    title: "cab Transfers from Babatpur Airport (VNS) to Assi Ghat",
    description: "Book a cab transfer from Babatpur Airport (VNS) to Assi Ghat and enjoy a hassle-free ride to your hotel.",
    imageUrl: '/images/promotions/img3.jpeg',
    badge: "Best Value",
    targetLink: "#cabs",
    buttonText: "Book Cab",
    isActive: true
  }
];

const rooms = [
  { name: 'The Kashi Kunj', type: 'Deluxe', price: 3500, discountPrice: 3000, capacity: 2, rating: 4.6,
    amenities: ['WiFi','AC','Parking','TV','Geyser'], images: [
      '/images/rooms/room1.jpg',
      '/images/rooms/room2.jpg',
      '/images/rooms/room3.jpg',
      '/images/rooms/room4.jpg',
      '/images/rooms/room5.jpg',
      '/images/rooms/wash1.jpg'
    ],
    description: 'Comfortable deluxe room near Ganga Ghats with modern amenities.',
    highlights: ['Just 50 meters from Assi Ghat', 'Property located directly on the main road — easy access', 'Free WiFi & daily housekeeping', 'Walking distance to cafes and ghats'] },
  // { name: 'Hotel Banaras Haveli', type: 'Super Deluxe', price: 2999, discountPrice: 2499, capacity: 3, rating: 4.7,
  //   amenities: ['WiFi','AC','Parking','TV','Geyser','Balcony'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700'],
  //   description: 'Spacious room with balcony view, ideal for families.',
  //   highlights: ['Balcony seating, quiet street-facing view', 'Just 50 meters from Assi Ghat', 'On the main road — no narrow lanes with luggage', 'Ideal for families & small groups'] },
  // { name: 'Hotel Kailash Palace', type: 'Suite', price: 4499, discountPrice: 3999, capacity: 4, rating: 4.9,
  //   amenities: ['WiFi','AC','Parking','TV','Geyser','Mini Fridge','Room Service'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700'],
  //   description: 'Premium suite with river-facing view and extra living space.',
  //   highlights: ['Largest room category with living space', 'Just 50 meters from Assi Ghat', 'In-house room service', 'Free parking on the main road'] },
    // { name: 'The Kashi Kunj', type: 'Deluxe', price: 2199, discountPrice: 1799, capacity: 2, rating: 4.6,
    // amenities: ['WiFi','AC','Parking','TV','Geyser'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700'],
    // description: 'Comfortable deluxe room near Ganga Ghats with modern amenities.',
    // highlights: ['Just 50 meters from Assi Ghat', 'Property located directly on the main road — easy access', 'Free WiFi & daily housekeeping', 'Walking distance to cafes and ghats'] },
  // { name: 'Hotel Banaras Haveli', type: 'Super Deluxe', price: 2999, discountPrice: 2499, capacity: 3, rating: 4.7,
  //   amenities: ['WiFi','AC','Parking','TV','Geyser','Balcony'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700'],
  //   description: 'Spacious room with balcony view, ideal for families.',
  //   highlights: ['Balcony seating, quiet street-facing view', 'Just 50 meters from Assi Ghat', 'On the main road — no narrow lanes with luggage', 'Ideal for families & small groups'] },
  // { name: 'Hotel Kailash Palace', type: 'Suite', price: 4499, discountPrice: 3999, capacity: 4, rating: 4.9,
  //   amenities: ['WiFi','AC','Parking','TV','Geyser','Mini Fridge','Room Service'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700'],
  //   description: 'Premium suite with river-facing view and extra living space.',
  //   highlights: ['Largest room category with living space', 'Just 50 meters from Assi Ghat', 'In-house room service', 'Free parking on the main road'] }
];

const cabs = [
  { name: 'Swift Dzire', type: 'Full Day Local Sightseeing', price: 3000, discountPrice: 2500, seats: 4, rating: 4.85,
    image: '/images/cabs/car1.jpeg', description: 'Comfortable sedan for local sightseeing.',
    highlights: ['AC sedan with experienced local driver', 'Covers Kashi Vishwanath, Sarnath, BHU, Ramnagar Fort', 'Airport / railway station pickup-drop available', 'Fuel & driver charges included'] },
  { name: 'Ertiga', type: 'Full Day Local Sightseeing', price: 3500, discountPrice: 3000, seats: 6, rating: 4.8,
    image: '/images/cabs/car2.jpeg', description: 'Spacious MUV for small families/groups.',
    highlights: ['6-seater, ideal for families/small groups', 'Covers Sarnath, Kaal Bhairav, Assi & Dashashwamedh Ghat', 'Airport pickup/drop available', 'AC + extra luggage space'] },
  { name: 'Innova Crysta', type: 'Airport Pickup/Drop', price: 2500, discountPrice: 2000, seats: 7, rating: 4.9,
    image: '/images/cabs/car3.jpeg', description: 'Premium comfortable ride for airport transfer.',
    highlights: ['Premium 7-seater, most comfortable option', 'Dedicated airport pickup & drop service', 'Also available for Prayagraj / Ayodhya outstation trips', 'Professional, verified drivers'] }
];

const boats = [
  { name: 'Sunrise Boat Ride - Assi Ghat', type: 'Motor Boat', price: 3000, discountPrice: 2000, rating: 4.9,
    duration: '1 hr', images: '/images/boats/boat1.jpeg', description: 'Morning boat ride to witness sunrise over Ganga.',
    highlights: ['Departs from Assi Ghat — 50 meters from our property', 'Best views of sunrise over the Ganga', 'Life jackets provided', 'Ideal before breakfast, 6:00–7:00 AM start'] },
  { name: 'Evening Ganga Aarti Boat', type: 'Maharaja Boat', price: 7000, discountPrice: 6000, rating: 4.85,
    duration: '45 min', images: [
      '/images/boats/boat2a.jpg',
      '/images/boats/boat2b.jpg',
      '/images/boats/boat2c.jpg'
    ], description: 'Private boat for the evening Ganga Aarti view.',
    highlights: ['Private boat, close-up view of Ganga Aarti', 'Pickup arranged from near the property', 'Best photography spot on the river', 'Evening slot, ~6:30–7:15 PM'] },
  // { name: 'Luxury Mini Yacht', type: 'Luxury Yacht', price: 5999, discountPrice: 4999, rating: 4.7,
  //   duration: '1.5 hr', image: '/images/boats/boat3.jpg', description: 'Luxury yacht ride for special occasions.',
  //   highlights: ['Premium yacht for anniversaries & celebrations', 'Seating & refreshments on board', 'Can be combined with Ganga Aarti timing', 'Advance booking recommended'] }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kashikunj');
  await Room.deleteMany({});
  await Cab.deleteMany({});
  await Ad.deleteMany({});
  await Boat.deleteMany({});
  await Room.insertMany(rooms);
  await Cab.insertMany(cabs);
  await Ad.insertMany(sampleAds);
  await Boat.insertMany(boats);
  console.log('Seed data inserted successfully');
  process.exit();
})();
