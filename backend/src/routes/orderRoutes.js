const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder
} = require('../controllers/orderController');

// POST /api/orders - Create order (checkout)
router.post('/', createOrder);

// GET /api/orders - Get user's order history
router.get('/', getOrders);

// GET /api/orders/:id - Get order details
router.get('/:id', getOrderById);

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', cancelOrder);

module.exports = router;
