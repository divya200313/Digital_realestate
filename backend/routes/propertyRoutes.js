const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController');
const { protect, isSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getProperties)
  .post(protect, isSeller, upload.array('images', 10), createProperty);

router.get('/my', protect, isSeller, getMyProperties);

router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, isSeller, upload.array('images', 10), updateProperty)
  .delete(protect, isSeller, deleteProperty);

module.exports = router;
