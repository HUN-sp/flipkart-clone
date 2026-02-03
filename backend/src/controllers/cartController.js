const { pool } = require('../config/db');

// GET /cart - Get user's cart
// Using user_id from header (x-user-id) for simplicity
const getCart = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required (x-user-id header)' 
            });
        }

        const [cartItems] = await pool.query(`
            SELECT 
                ci.id,
                ci.quantity,
                ci.created_at,
                p.id as product_id,
                p.name,
                p.price,
                p.original_price,
                p.discount_percent,
                p.image_url,
                p.brand,
                p.stock,
                (p.price * ci.quantity) as item_total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ? AND p.is_active = TRUE
            ORDER BY ci.created_at DESC
        `, [userId]);

        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.item_total), 0);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalDiscount = cartItems.reduce((sum, item) => {
            if (item.original_price) {
                return sum + ((item.original_price - item.price) * item.quantity);
            }
            return sum;
        }, 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                summary: {
                    totalItems,
                    subtotal: subtotal.toFixed(2),
                    totalDiscount: totalDiscount.toFixed(2),
                    total: subtotal.toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /cart - Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { product_id, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required (x-user-id header)' 
            });
        }

        if (!product_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Product ID required' 
            });
        }

        // Check if product exists and has stock
        const [products] = await pool.query(
            'SELECT id, stock, name FROM products WHERE id = ? AND is_active = TRUE',
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Product not found' 
            });
        }

        if (products[0].stock < quantity) {
            return res.status(400).json({ 
                success: false, 
                error: 'Insufficient stock',
                available: products[0].stock
            });
        }

        // Check if item already in cart (upsert)
        const [existing] = await pool.query(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existing.length > 0) {
            // Update quantity
            const newQuantity = existing[0].quantity + quantity;
            
            if (newQuantity > products[0].stock) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Cannot add more items. Insufficient stock.',
                    available: products[0].stock,
                    inCart: existing[0].quantity
                });
            }

            await pool.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existing[0].id]
            );

            res.json({
                success: true,
                message: 'Cart updated',
                data: { id: existing[0].id, quantity: newQuantity }
            });
        } else {
            // Insert new item
            const [result] = await pool.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, product_id, quantity]
            );

            res.status(201).json({
                success: true,
                message: 'Added to cart',
                data: { id: result.insertId, product_id, quantity }
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// PUT /cart/:id - Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;
        const { quantity } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required (x-user-id header)' 
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ 
                success: false, 
                error: 'Valid quantity required (minimum 1)' 
            });
        }

        // Get cart item with product info
        const [cartItems] = await pool.query(`
            SELECT ci.*, p.stock, p.name
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.id = ? AND ci.user_id = ?
        `, [id, userId]);

        if (cartItems.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Cart item not found' 
            });
        }

        if (quantity > cartItems[0].stock) {
            return res.status(400).json({ 
                success: false, 
                error: 'Insufficient stock',
                available: cartItems[0].stock
            });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [quantity, id]
        );

        res.json({
            success: true,
            message: 'Cart updated',
            data: { id: parseInt(id), quantity }
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /cart/:id - Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required (x-user-id header)' 
            });
        }

        const [result] = await pool.query(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Cart item not found' 
            });
        }

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /cart - Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'User ID required (x-user-id header)' 
            });
        }

        await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        res.json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
