const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById
} = require('../controllers/categoryController');

// GET /api/categories - List all categories
router.get('/', getCategories);

// GET /api/categories/:id - Get category with products
router.get('/:id', getCategoryById);

module.exports = router;
