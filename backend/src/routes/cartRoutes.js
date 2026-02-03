const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', updateCartItem);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

module.exports = router;
