const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    searchProducts
} = require('../controllers/productController');

// GET /api/products - List products with filters
router.get('/', getProducts);

// GET /api/products/search/:query - Full-text search
router.get('/search/:query', searchProducts);

// GET /api/products/:id - Get product details
router.get('/:id', getProductById);

module.exports = router;
