const mongoose = require('mongoose');

// Load .env locally if it exists (ignored on Hostinger safely)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error('MONGO_URI is undefined. Check your Hostinger Environment Variables.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
