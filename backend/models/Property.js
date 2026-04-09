const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please add an address'],
      },
      city: {
        type: String,
        required: [true, 'Please add a city'],
      },
      state: {
        type: String,
        required: [true, 'Please add a state'],
      },
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'land'],
      required: [true, 'Please select a property type'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    area: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'sold'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
