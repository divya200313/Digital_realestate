const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');

// @desc    Get all properties with multiple filters
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const {
    search,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    amenities,
    page = 1,
    limit = 9,
  } = req.query;

  const query = { status: 'active' };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { 'location.state': { $regex: search, $options: 'i' } },
    ];
  }

  if (type) query.type = type;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
  if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

  if (amenities) {
    const amenitiesArray = amenities.split(',');
    query.amenities = { $all: amenitiesArray };
  }

  const skip = (page - 1) * limit;

  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('seller', 'name email');

  const total = await Property.countDocuments(query);

  res.status(200).json({
    properties,
    page: Number(page),
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'seller',
    'name email'
  );

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  res.status(200).json(property);
});

// @desc    Create a new listing
// @route   POST /api/properties
// @access  Private (Seller only)
const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    location,
    type,
    amenities,
    bedrooms,
    bathrooms,
    area,
  } = req.body;

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }

  const imageUrls = req.files.map((file) => file.path);

  // location and amenities come as strings if using FormData with Multer
  const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
  const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

  const property = await Property.create({
    seller: req.user.id,
    title,
    description,
    price,
    location: parsedLocation,
    type,
    amenities: parsedAmenities,
    images: imageUrls,
    bedrooms,
    bathrooms,
    area,
  });

  res.status(201).json(property);
});

// @desc    Update a listing
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if seller matches owner
  if (property.seller.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const { location, amenities, existingImages, ...rest } = req.body;

  const updateData = { ...rest };

  if (location) {
    updateData.location = typeof location === 'string' ? JSON.parse(location) : location;
  }
  if (amenities) {
    updateData.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
  }

  // Handle images: combines existing and new ones
  let imageUrls = [];
  if (existingImages) {
    imageUrls = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
  }

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => file.path);
    imageUrls = [...imageUrls, ...newImages];
  }

  if (imageUrls.length > 0) {
    updateData.images = imageUrls;
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.status(200).json(updatedProperty);
});

// @desc    Delete a listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if seller matches owner
  if (property.seller.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await property.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get my listings
// @route   GET /api/properties/my
// @access  Private (Seller only)
const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ seller: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json(properties);
});

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
