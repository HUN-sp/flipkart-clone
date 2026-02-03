const { pool } = require('../config/db');

// GET /categories - Get all categories with product count
const getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query(`
            SELECT 
                c.*,
                COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
            GROUP BY c.id
            ORDER BY c.name ASC
        `);

        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /categories/:id - Get category with its products
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Get category
        const [categories] = await pool.query(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );

        if (categories.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Category not found' 
            });
        }

        // Get products in category
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const [products] = await pool.query(`
            SELECT * FROM products 
            WHERE category_id = ? AND is_active = TRUE
            ORDER BY rating DESC
            LIMIT ? OFFSET ?
        `, [id, parseInt(limit), offset]);

        // Get total count
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as total FROM products WHERE category_id = ? AND is_active = TRUE',
            [id]
        );

        res.json({
            success: true,
            data: {
                category: categories[0],
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getCategories,
    getCategoryById
};
