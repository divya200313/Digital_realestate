const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for clearing data...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const clearData = async () => {
  try {
    await connectDB();

    // 1. Delete all properties
    await Property.deleteMany({});
    console.log('✅ All properties deleted.');

    // 2. Delete all users (optional - keeping it for a full reset)
    await User.deleteMany({});
    console.log('✅ All users deleted.');

    console.log('🚀 Database cleared successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Clearing failed:', err.message);
    process.exit(1);
  }
};

clearData();
