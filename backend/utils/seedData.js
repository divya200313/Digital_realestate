const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const sampleProperties = [
  {
    title: 'Modern Luxury Apartment',
    description: 'A stunning modern apartment with panoramic city views and premium finishes throughout.',
    price: 450000,
    location: { address: '123 Skyline Blvd', city: 'Los Angeles', state: 'CA' },
    type: 'apartment',
    amenities: ['Pool', 'Gym', 'Parking', 'Security'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    status: 'active',
  },
  {
    title: 'Cozy Family House',
    description: 'Perfect for a growing family, this house features a large backyard and spacious living areas.',
    price: 320000,
    location: { address: '456 Oak Street', city: 'Austin', state: 'TX' },
    type: 'house',
    amenities: ['Garden', 'Parking', 'Balcony', 'Pet Friendly'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    status: 'active',
  },
  {
    title: 'Ocean View Villa',
    description: 'Experience ultimate luxury in this coastal villa with private beach access and an infinity pool.',
    price: 1250000,
    location: { address: '789 Marine Drive', city: 'Miami', state: 'FL' },
    type: 'villa',
    amenities: ['Pool', 'Garden', 'Security', 'Balcony', 'Internet', 'Air Conditioning'],
    images: ['https://images.unsplash.com/photo-1613977218684-25e9acc3892c?w=800&q=80'],
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    status: 'active',
  },
  {
    title: 'Downtown Loft',
    description: 'Chic urban loft with exposed brick and industrial vibes in the heart of the city.',
    price: 275000,
    location: { address: '101 Urban Lane', city: 'Chicago', state: 'IL' },
    type: 'apartment',
    amenities: ['Gym', 'Security', 'Elevator', 'Internet'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    status: 'active',
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // 1. Create a dummy seller
    const sellerExists = await User.findOne({ email: 'seller@example.com' });
    let seller;
    if (sellerExists) {
      seller = sellerExists;
      console.log('Seller already exists...');
    } else {
      seller = await User.create({
        name: 'John Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller'
      });
      console.log('✅ Created dummy seller (email: seller@example.com, pass: password123)');
    }

    // 2. Clear existing properties
    await Property.deleteMany({ seller: seller._id });
    console.log('Cleared old properties for this seller...');

    // 3. Add properties
    const propertiesWithSeller = sampleProperties.map(p => ({ ...p, seller: seller._id }));
    await Property.insertMany(propertiesWithSeller);
    console.log('✅ Seeded 4 sample properties!');

    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
