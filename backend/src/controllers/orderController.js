const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// POST /orders - Create order from cart (checkout)
const createOrder = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const userId = req.headers['x-user-id'];
        const { shipping_address, payment_method = 'COD' } = req.body;


        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID required (x-user-id header)'
            });
        }

        if (!shipping_address) {
            return res.status(400).json({
                success: false,
                error: 'Shipping address required'
            });
        }

        await connection.beginTransaction();

        // Get cart items
        const [cartItems] = await connection.query(`
            SELECT 
                ci.product_id,
                ci.quantity,
                p.price,
                p.stock,
                p.name
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ? AND p.is_active = TRUE
            FOR UPDATE
        `, [userId]);

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }

        // Verify stock for all items
        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for "${item.name}"`,
                    available: item.stock,
                    requested: item.quantity
                });
            }
        }

        // Calculate total
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        // Create order
        const orderId = uuidv4();
        await connection.query(`
            INSERT INTO orders (id, user_id, total_amount, shipping_address, payment_method, status)
            VALUES (?, ?, ?, ?, ?, 'confirmed')
        `, [orderId, userId, totalAmount, JSON.stringify(shipping_address), payment_method]);

        // Create order items and update stock
        for (const item of cartItems) {
            // Add to order_items
            await connection.query(`
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
            `, [orderId, item.product_id, item.quantity, item.price]);

            // Reduce stock
            await connection.query(`
                UPDATE products SET stock = stock - ? WHERE id = ?
            `, [item.quantity, item.product_id]);
        }

        // Clear cart
        await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        await connection.commit();

        // Fetch complete order details
        const [orders] = await pool.query(`
            SELECT * FROM orders WHERE id = ?
        `, [orderId]);

        const [orderItems] = await pool.query(`
            SELECT 
                oi.*,
                p.name,
                p.image_url,
                p.brand
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: {
                ...orders[0],
                shipping_address: (typeof orders[0].shipping_address === 'string')
                    ? JSON.parse(orders[0].shipping_address)
                    : orders[0].shipping_address,
                items: orderItems
            }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
};

// GET /orders - Get user's order history
const getOrders = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { page = 1, limit = 10, status } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID required (x-user-id header)'
            });
        }

        let query = 'SELECT * FROM orders WHERE user_id = ?';
        const params = [userId];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        // Count total
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.query(countQuery, params);

        // Add pagination
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const [orders] = await pool.query(query, params);

        // Get items for each order
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await pool.query(`
                    SELECT 
                        oi.*,
                        p.name,
                        p.image_url,
                        p.brand
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                `, [order.id]);

                return {
                    ...order,
                    shipping_address: (order.shipping_address && typeof order.shipping_address === 'string')
                        ? JSON.parse(order.shipping_address)
                        : order.shipping_address,
                    items,
                    item_count: items.reduce((sum, item) => sum + item.quantity, 0)
                };
            })
        );

        res.json({
            success: true,
            data: ordersWithItems,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /orders/:id - Get single order details
const getOrderById = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID required (x-user-id header)'
            });
        }

        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        const [items] = await pool.query(`
            SELECT 
                oi.*,
                p.name,
                p.image_url,
                p.brand,
                p.description
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [id]);

        res.json({
            success: true,
            data: {
                ...orders[0],
                shipping_address: (typeof orders[0].shipping_address === 'string')
                    ? JSON.parse(orders[0].shipping_address)
                    : orders[0].shipping_address,
                items
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// PUT /orders/:id/cancel - Cancel order
const cancelOrder = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID required (x-user-id header)'
            });
        }

        await connection.beginTransaction();

        // Get order
        const [orders] = await connection.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ? FOR UPDATE',
            [id, userId]
        );

        if (orders.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        if (orders[0].status === 'cancelled') {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: 'Order already cancelled'
            });
        }

        if (['shipped', 'delivered'].includes(orders[0].status)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: 'Cannot cancel order that has been shipped or delivered'
            });
        }

        // Restore stock
        const [items] = await connection.query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [id]
        );

        for (const item of items) {
            await connection.query(
                'UPDATE products SET stock = stock + ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Update order status
        await connection.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['cancelled', id]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder
};
