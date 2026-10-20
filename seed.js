// Run: node seed.js  -> populates sample rooms, cabs, boats
require("dotenv").config();
const mongoose = require("mongoose");
const Room = require("./models/Room");
const Cab = require("./models/Cab");
const Boat = require("./models/Boat");
const Ad = require("./models/Ad");
const Place = require("./models/Place");
const Review = require("./models/Review"); // 1. Add the Review model
const Blog = require("./models/Blog"); // Import Blog model

// 2. Add sample ad data:
const sampleAds = [
  // {
  //   name: "Dev Diwali Boat Rides - Limited Offer",
  //   description: "Book your Dev Diwali boat ride now and enjoy a special discount for a limited time.",
  //   imageUrl: '/images/promotions/pimg1.jpeg',
  //   badge: "Limited Deal",
  //   targetLink: "#boats",
  //   buttonText: "Book Boat Ride & Claim Discount",
  //   isActive: true
  // },
  {
    name: "Stays at The Kashi Kunj - Special Offer",
    description:
      "Book your stay at The Kashi Kunj and enjoy a complimentary boat ride on the Ganga during your visit.",
    imageUrl: "/images/promotions/pimg2.jpeg",
    badge: "Best Value",
    targetLink: "#rooms",
    buttonText: "Book Room",
    isActive: true,
  },
  {
    name: "cab Transfers from Babatpur Airport (VNS) to Assi Ghat",
    description:
      "Book a cab transfer from Babatpur Airport (VNS) to Assi Ghat and enjoy a hassle-free ride to your hotel.",
    imageUrl: "/images/promotions/pimg3.jpeg",
    badge: "Best Value",
    targetLink: "#cabs",
    buttonText: "Book Cab",
    isActive: true,
  },
];

const rooms = [
  {
    name: "The Kashi Kunj - #Property1",
    type: "King Size Bed",
    price: 2599,
    order: 1,
    discountPrice: 1899,
    capacity: 2,
    rating: 4.6,
    amenities: ["WiFi", "AC", "Parking", "TV", "Geyser"],
    images: [
      "/images/rooms/room1.jpg",
      "/images/rooms/room2.jpg",
      "/images/rooms/room3.jpg",
      "/images/rooms/room4.jpg",
      "/images/rooms/room5.jpg",
      "/images/rooms/wash1.jpg",
    ],
    description:
      "Comfortable deluxe room near Ganga Ghats with modern amenities.",
    highlights: [
      "Just 50 meters from Assi Ghat",
      "Property located directly on the main road — easy access",
      "Free WiFi & daily housekeeping",
      "Walking distance to cafes and ghats",
    ],
  },
  {
    name: "#Property2",
    type: "Super Deluxe",
    price: 2999,
    order: 2,
    discountPrice: 2499,
    capacity: 3,
    rating: 4.7,
    amenities: ["WiFi", "AC", "Parking", "TV", "Geyser", "Balcony"],
    images: [
      "/images/rooms/Property2-1.jpeg",
      "/images/rooms/Property2-2.jpeg",
      "/images/rooms/Property2-3.jpeg",
      "/images/rooms/Property2-4.jpeg",
      "/images/rooms/Property2-5.jpeg",
    ],
    description: "Spacious room with balcony view, ideal for families.",
    highlights: [
      "Balcony seating, quiet street-facing view",
      "Just 50 meters from Assi Ghat",
      "On the main road — no narrow lanes with luggage",
      "Ideal for families & small groups",
    ],
  },
  // { name: '#Property3', type: 'Suite', price: 4499, discountPrice: 3999, capacity: 4, rating: 4.9,
  //   amenities: ['WiFi','AC','Parking','TV','Geyser','Mini Fridge','Room Service'], images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700'],
  //   description: 'Premium suite with river-facing view and extra living space.',
  //   highlights: ['Largest room category with living space', 'Just 50 meters from Assi Ghat', 'In-house room service', 'Free parking on the main road'] },
  //   { name: '#Property4', type: 'Deluxe', price: 2199, discountPrice: 1799, capacity: 2, rating: 4.6,
  //   amenities: ['WiFi','AC','Parking','TV','Geyser'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700'],
  //   description: 'Comfortable deluxe room near Ganga Ghats with modern amenities.',
  //   highlights: ['Just 50 meters from Assi Ghat', 'Property located directly on the main road — easy access', 'Free WiFi & daily housekeeping', 'Walking distance to cafes and ghats'] },
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
  {
    name: "Swift Dzire",
    type: "Full Day Local Sightseeing",
    price: 3000,
    order: 1,
    discountPrice: 2500,
    seats: 4,
    rating: 4.85,
    image: "/images/cabs/car1.jpeg",
    description: "Comfortable sedan for local sightseeing.",
    highlights: [
      "AC sedan with experienced local driver",
      "Covers Kashi Vishwanath, Sarnath, BHU, Ramnagar Fort",
      "Airport / railway station pickup-drop available",
      "Fuel & driver charges included",
    ],
  },
  {
    name: "Ertiga",
    type: "Full Day Local Sightseeing",
    price: 3500,
    order: 2,
    discountPrice: 3000,
    seats: 6,
    rating: 4.8,
    image: "/images/cabs/car2.jpeg",
    description: "Spacious MUV for small families/groups.",
    highlights: [
      "6-seater, ideal for families/small groups",
      "Covers Sarnath, Kaal Bhairav, Assi & Dashashwamedh Ghat",
      "Airport pickup/drop available",
      "AC + extra luggage space",
    ],
  },
  {
    name: "Innova Crysta",
    type: "Airport Pickup/Drop",
    price: 5000,
    order: 3,
    discountPrice: 4000,
    seats: 7,
    rating: 4.9,
    image: "/images/cabs/car3.jpeg",
    description: "Premium comfortable ride for airport transfer.",
    highlights: [
      "Premium 7-seater, most comfortable option",
      "Dedicated airport pickup & drop service",
      "Also available for Prayagraj / Ayodhya outstation trips",
      "Professional, verified drivers",
    ],
  },
];

const boats = [
  {
    name: "Dev Diwali(Motor Boat) - Assi Ghat",
    type: "Motor Boat",
    price: 2999,
    order: 1,
    discountPrice: 2399,
    rating: 4.9,
    duration: "3 hr",
    images: "/images/boats/boat1.jpeg",
    description:
      "Evening boat ride to witness Full Dev Diwali Event over Ganga.",
    tagsHtml:
      '<span class="feature-tag">🌅 Full Dev Diwali Events</span><span class="feature-tag">🛶 Sharing Boat</span><span class="feature-tag">🦺 Life Jackets</span>',
    highlights: [
      "Departs from Assi Ghat — 50 meters from our property",
      "Best views of Fire Shows, Leser Shows, Evening Ganga Aarti, Drone Show etc. over the Ganga",
      "Life jackets provided",
      "Ideal before breakfast, 5:00–5:15 PM start",
    ],
  },
  {
    name: "Dev Diwali(Maharaja Boat)",
    type: "Maharaja Boat - Best View",
    price: 5999,
    order: 2,
    discountPrice: 4999,
    rating: 4.85,
    duration: "3hr 30min",
    images: [
      "/images/boats/mboat1.jpeg",
      "/images/boats/mboat2.jpeg",
      "/images/boats/mboat3.jpeg",
    ],
    description: "Private boat for the evening Ganga Aarti view.",
    // bookedSeats: ["S2", "S5"], // Pre-seeded example of booked seats
    tagsHtml:
      '<span class="feature-tag">🌅 Full Dev Diwali Events</span><span class="feature-tag">🛶 Sharing Boat</span><span class="feature-tag">🦺 Life Jackets</span><span class="feature-tag"> Best View</span>',
    highlights: [
      "Evening boat ride with best View to witness Full Dev Diwali Event over Ganga.",
      "Pickup arranged from near the property",
      "Best photography spot on the river",
      "Evening slot, ~5:00–5:15 PM start",
    ],
  },
  { name: 'Ganges Cruise', type: 'Luxury Cruise', price: 11999, discountPrice: 6999, rating: 4.7,
    duration: '3.5 hr', image: '/images/boats/boat3.jpeg', description: 'Luxury yacht ride for special occasions.',
     order: 3,
    highlights: ['Premium yacht for anniversaries & celebrations', 'Seating & refreshments on board', 'Can be combined with Ganga Aarti timing', 'Advance booking recommended'] }
];

const initialPlaces = [
  {
    slug: "ganga-aarti",
    name: "Ganga Aarti at Assi Ghat",
    image: "/images/places/gangaaartiD.jpg",
    short:
      "The evening ritual of fire, chanting and music on the banks of the Ganga.",
    distance: "2.5 km from The Kashi Kunj",
    highlights: [
      "Held every evening at Assi Ghat, just after sunset",
      "Best experienced from a private boat on the river",
      "Arrive 30–45 minutes early for a good viewing spot",
      "We arrange a private boat pickup for Aarti viewing — ask our team",
    ],
    order: 1,
  },
  {
    slug: "kaal-bhairav",
    name: "Kaal Bhairav Temple",
    image: "/images/places/kaalbhairav.jpg",
    short:
      "One of the most powerful temples in Varanasi, dedicated to Kaal Bhairav — the guardian deity of Kashi.",
    distance: "4 km from The Kashi Kunj",
    highlights: [
      "Considered the protector deity of Varanasi",
      "Popular for seeking protection & removing obstacles",
      "Best visited early morning to avoid crowds",
      "Easily combined with a Kashi Vishwanath temple visit",
    ],
    order: 2,
  },
  {
    slug: "sarnath",
    name: "Sarnath",
    image: "/images/places/sarnath.jpg",
    short:
      "The place where Buddha gave his first sermon after attaining enlightenment.",
    distance: "13 km from The Kashi Kunj",
    highlights: [
      "Home to the Dhamek Stupa and ancient Buddhist ruins",
      "Sarnath Museum houses the original Ashoka Lion Capital",
      "Peaceful gardens, ideal for a half-day trip",
      "Best combined with a full-day cab booking",
    ],
    order: 3,
  },
  {
    slug: "bhu-campus",
    name: "BHU Campus",
    image: "/images/places/bhu.jpg",
    short:
      "Banaras Hindu University — one of India's largest residential universities, with the iconic New Vishwanath Temple.",
    distance: "6 km from The Kashi Kunj",
    highlights: [
      "Beautiful green campus, popular for a relaxed walk",
      "New Vishwanath Temple built inside the campus",
      "Bharat Kala Bhavan museum for art & history lovers",
      "Great stop between city sightseeing points",
    ],
    order: 4,
  },
  {
    slug: "ramnagar-fort",
    name: "Ramnagar Fort",
    image: "/images/places/ramnagar.jpg",
    short:
      "A centuries-old fort on the eastern bank of the Ganga, home to the Kashi Naresh (King of Varanasi).",
    distance: "9 km from The Kashi Kunj",
    highlights: [
      "Museum with vintage cars, weapons & royal palanquins",
      "Best views from across the river at sunset",
      "Still the residence of the Kashi Naresh royal family",
      "Combine with a boat ride for the best experience",
    ],
    order: 5,
  },
  {
    slug: "assi-ghat",
    name: "Assi Ghat",
    image: "/images/places/assi.jpg",
    short:
      "The southernmost of Varanasi's ghats, and the one right next to The Kashi Kunj.",
    distance: "Just 50 meters from The Kashi Kunj",
    highlights: [
      "Right at our doorstep — a 1-minute walk from the property",
      "Popular for morning yoga & sunrise boat rides",
      "Lively evening Subah-e-Banaras cultural program",
      "Great base for exploring the ghats on foot",
    ],
    order: 6,
  },
  {
    slug: "dashashwamedh-ghat",
    name: "Dashashwamedh Ghat",
    image: "/images/places/dasha.jpg",
    short:
      "The main ghat of Varanasi and the venue for the famous evening Ganga Aarti.",
    distance: "2.5 km from The Kashi Kunj",
    highlights: [
      "Most iconic and busiest ghat in Varanasi",
      "Site of the nightly Ganga Aarti ceremony",
      "Best reached by boat directly from Assi Ghat",
      "Surrounded by markets, food stalls & boat operators",
    ],
    order: 7,
  },
  {
    slug: "kashi-vishwanth-temple",
    name: "Kashi Vishwanth Temple",
    image: "/images/places/kashivis.jpg",
    short:
      "The most famous temple in Varanasi, dedicated to Lord Shiva, and a major pilgrimage site.",
    distance: "2 km from The Kashi Kunj",
    highlights: [
      "One of the twelve Jyotirlingas in India",
      "Best visited early morning or late evening to avoid crowds",
      "Photography is not allowed inside the temple premises",
      "Combine with a visit to nearby ghats and markets",
    ],
    order: 8,
  },
  {
    slug: "sankatmochan-temple",
    name: "Sankatmochan Temple",
    image: "/images/places/sankatmochan.jpeg",
    short:
      "A popular temple dedicated to Lord Hanuman, known for its spiritual significance.",
    distance: "1.5 km from The Kashi Kunj",
    highlights: [
      "Popular for its spiritual significance",
      "Known for its beautiful architecture",
      "Frequented by devotees from all over the world",
      "Combine with a visit to nearby ghats and markets",
    ],
    order: 9,
  },
];
// 2. Add sample reviews:
const sampleReviews = [
  {
    guestName: "Ramesh Sharma",
    location: "Delhi",
    initial: "R", // Explicitly added here
    rating: 5,
    text: "Very comfortable stay, walking distance from the ghats. The boat ride they arranged for Ganga Aarti was the highlight of our trip.",
    isApproved: true
  },
  {
    guestName: "Priya Kulkarni",
    location: "Mumbai",
    initial: "P", // Explicitly added here
    rating: 5,
    text: "Clean rooms, friendly staff, and the cab booking was hassle-free for our Sarnath trip. Highly recommend The Kashi Kunj.",
    isApproved: true
  },
  {
    guestName: "Arjun Nair",
    location: "Bengaluru",
    initial: "A", // Explicitly added here
    rating: 5,
    text: "Great location on the main road, making auto and cab transit super easy. Instant WhatsApp replies made everything smooth.",
    isApproved: true
  }
];

const sampleBlogs = [
  {
    title: "Ultimate 2-Day Varanasi Itinerary: Spiritual Awakening & Heritage",
    slug: "ultimate-2-day-varanasi-itinerary",
    image: "/images/places/gangaaartiD.jpg",
    category: "Itinerary",
    readTime: "6 min read",
    excerpt: "Discover how to spend 48 hours in the spiritual capital of India, from dawn boat rides at Assi Ghat to evening Ganga Aarti.",
    content: `
      <h3>Day 1: The Sacred River & Ancient Alleys</h3>
      <p><strong>5:30 AM - Sunrise Boat Ride at Assi Ghat:</strong> Begin your Kashi journey right where the morning comes alive. Taking a rowing boat from Assi Ghat allows you to witness the chanting, yoga sessions, and the breathtaking colors of dawn over the Ganges.</p>
      <p><strong>9:00 AM - Traditional Banarasi Breakfast:</strong> Savor hot Kachori-Sabzi and sweet Jalebis in the narrow lanes (galis) near Godowlia.</p>
      <p><strong>5:00 PM - Evening Ganga Aarti:</strong> Head to Dashashwamedh Ghat or experience it comfortably from a private boat on the river to watch the synchronized ritual of fire and hymns.</p>
      
      <h3>Day 2: Temples & Historic Excursions</h3>
      <p><strong>7:00 AM - Kashi Vishwanath Darshan:</strong> Visit the sacred corridor early in the morning to beat the rush.</p>
      <p><strong>11:00 AM - Half-Day Trip to Sarnath:</strong> Take a comfortable air-conditioned cab to Sarnath, where Buddha delivered his first sermon.</p>
    `,
    order: 1
  },
  {
    title: "Differences Between Dashashwamedh and Assi Ghat: Where Should You Stay?",
    slug: "dashashwamedh-vs-assi-ghat",
    image: "/images/places/assi.jpg",
    category: "Guide",
    readTime: "4 min read",
    excerpt: "Planning a trip to Kashi? Understand the vibe difference between the bustling Dashashwamedh Ghat and the peaceful Assi Ghat.",
    content: `
      <p>Varanasi's riverfront is lined with 84 ghats, but two stand out as the primary cultural hubs: <strong>Assi Ghat</strong> and <strong>Dashashwamedh Ghat</strong>.</p>
      <h3>Assi Ghat: The Cultural & Peaceful Hub</h3>
      <p>Located at the southern end, Assi Ghat is famous for its morning <em>Subah-e-Banaras</em> program, yoga sessions, and calmer atmosphere. It is directly accessible via wide main roads, making it ideal for families and travelers carrying luggage who want to avoid chaotic crowds.</p>
      <h3>Dashashwamedh Ghat: The Heart of Rituals</h3>
      <p>This is the main commercial and spiritual center where the grand evening Aarti takes place every single day. While vibrant and energetic, the surrounding lanes are extremely narrow and vehicle-free.</p>
      <p><strong>Pro Tip:</strong> Staying near Assi Ghat (at properties like The Kashi Kunj) gives you peaceful rest at night while keeping you just minutes away from all major attractions.</p>
    `,
    order: 2
  },
  {
    title: "How to Book the Best Ganga Aarti Boat Ride in Varanasi",
    slug: "how-to-book-best-ganga-aarti-boat",
    image: "/images/places/dasha.jpg",
    category: "Boat Tours",
    readTime: "5 min read",
    excerpt: "Avoid tourist traps and crowded wooden planks. Here is your complete guide to booking a safe, scenic private boat for the Ganga Aarti.",
    content: `
      <p>Watching the glowing oil lamps float down the Ganges during the evening Aarti is a life-changing experience—provided you have the right vantage point.</p>
      <h3>Why Private Boats Beat Crowded Platforms</h3>
      <p>Standing on the shore at Dashashwamedh Ghat can get overwhelmingly crowded. Renting a private rowing or motor boat from Assi Ghat lets you cruise gently up to the ceremony, giving you a front-row, unobstructed view without getting jostled by crowds.</p>
      <h3>What to Look For When Booking</h3>
      <ul>
        <li><strong>Life Jackets:</strong> Ensure your boat operator provides clean safety equipment.</li>
        <li><strong>Transparent Pricing:</strong> Avoid street-side touts who inflate prices at sunset. Booking directly through your trusted accommodation ensures fixed, honest tariffs.</li>
      </ul>
    `,
    order: 3
  },
  {
    title: "The Ultimate 1-Day Varanasi Itinerary (Sunrise to Aarti)",
    slug: "ultimate-1-day-varanasi-itinerary",
    image: "/images/places/gangaaartiD.jpg",
    category: "Itinerary",
    readTime: "5 min read",
    excerpt: "Short on time? Here is the exact blueprint to experience the spiritual heart of Kashi in 24 hours.",
    content: `...`, // paste HTML content here
    order: 4
  },
  {
    title: "The Perfect 3-Day Varanasi & Sarnath Itinerary",
    slug: "perfect-3-day-varanasi-itinerary",
    image: "/images/places/sarnath.jpg",
    category: "Itinerary",
    readTime: "8 min read",
    excerpt: "Dive deep into the spiritual, historical, and culinary dimensions of Kashi with this immersive 3-day travel plan.",
    content: `...`, // paste HTML content here
    order: 5
  },
  {
    title: "Top 5 Street Foods You Must Try in Varanasi",
    slug: "top-5-street-foods-in-varanasi",
    image: "/images/places/assi.jpg",
    category: "Food & Culture",
    readTime: "4 min read",
    excerpt: "From winter-special Malaiyo to spicy Tamatar Chaat, here are the iconic culinary delights of the holy city.",
    content: `...`, // paste HTML content here
    order: 6
  }
];
(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kashikunj",
  );
  await Room.deleteMany({});
  await Cab.deleteMany({});
  await Place.deleteMany({});
  await Ad.deleteMany({});
  await Boat.deleteMany({});
  await Review.deleteMany({});
  await Blog.deleteMany({});
  await Room.insertMany(rooms);
  await Cab.insertMany(cabs);
  await Ad.insertMany(sampleAds);
  await Boat.insertMany(boats);
  await Place.insertMany(initialPlaces);
  await Review.insertMany(sampleReviews);
  await Blog.insertMany(sampleBlogs);
  console.log("Seed data inserted successfully");
  process.exit();
})();
