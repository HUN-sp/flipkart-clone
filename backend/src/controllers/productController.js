const { pool } = require('../config/db');

// GET /products - List all products with filters, search, pagination
const getProducts = async (req, res) => {
    try {
        const {
            category,      // Filter by category ID or name
            brand,         // Filter by brand
            min_price,     // Minimum price
            max_price,     // Maximum price
            search,        // Search in name, description, brand
            sort,          // price_asc, price_desc, rating, newest
            page = 1,
            limit = 10
        } = req.query;

        let query = `
            SELECT 
                p.*,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = TRUE
        `;
        const params = [];

        // Apply filters
        if (category) {
            if (isNaN(category)) {
                query += ` AND c.name LIKE ?`;
                params.push(`%${category}%`);
            } else {
                query += ` AND p.category_id = ?`;
                params.push(parseInt(category));
            }
        }

        if (brand) {
            query += ` AND p.brand LIKE ?`;
            params.push(`%${brand}%`);
        }

        if (min_price) {
            query += ` AND p.price >= ?`;
            params.push(parseFloat(min_price));
        }

        if (max_price) {
            query += ` AND p.price <= ?`;
            params.push(parseFloat(max_price));
        }

        if (search) {
            // Normalize search term - handle plurals by removing trailing 's'
            let searchTerm = search.trim().toLowerCase();
            let singularTerm = searchTerm;

            // Remove trailing 's' for plural handling (laptops -> laptop, mobiles -> mobile)
            if (searchTerm.endsWith('s') && searchTerm.length > 3) {
                singularTerm = searchTerm.slice(0, -1);
            }

            // Search for both original term and singular version
            query += ` AND (
                p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR c.name LIKE ?
                OR p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR c.name LIKE ?
            )`;
            const searchPattern = `%${searchTerm}%`;
            const singularPattern = `%${singularTerm}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
            params.push(singularPattern, singularPattern, singularPattern, singularPattern);
        }

        // Count total for pagination
        const countQuery = query.replace(
            /SELECT[\s\S]*?FROM/,
            'SELECT COUNT(*) as total FROM'
        );
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;

        // Apply sorting
        switch (sort) {
            case 'price_asc':
                query += ` ORDER BY p.price ASC`;
                break;
            case 'price_desc':
                query += ` ORDER BY p.price DESC`;
                break;
            case 'rating':
                query += ` ORDER BY p.rating DESC`;
                break;
            case 'newest':
                query += ` ORDER BY p.created_at DESC`;
                break;
            default:
                query += ` ORDER BY p.id DESC`;
        }

        // Apply pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset);

        const [products] = await pool.query(query, params);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /products/:id - Get single product with full details
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.query(`
            SELECT 
                p.*,
                c.name as category_name,
                c.description as category_description
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ? AND p.is_active = TRUE
        `, [id]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Parse JSON fields
        const product = products[0];
        if (product.highlights && typeof product.highlights === 'string') {
            product.highlights = JSON.parse(product.highlights);
        }
        if (product.specifications && typeof product.specifications === 'string') {
            product.specifications = JSON.parse(product.specifications);
        }

        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /products/search/:query - Full-text search (alternative endpoint)
const searchProducts = async (req, res) => {
    try {
        const { query } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const [products] = await pool.query(`
            SELECT 
                p.*,
                c.name as category_name,
                MATCH(p.name, p.description, p.brand) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = TRUE
            AND MATCH(p.name, p.description, p.brand) AGAINST(? IN NATURAL LANGUAGE MODE)
            ORDER BY relevance DESC
            LIMIT ? OFFSET ?
        `, [query, query, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);

        res.json({ success: true, data: products });
    } catch (error) {
        // Fallback to LIKE search if FULLTEXT fails
        const { query } = req.params;
        const searchTerm = `%${query}%`;

        const [products] = await pool.query(`
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = TRUE
            AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)
            LIMIT 20
        `, [searchTerm, searchTerm, searchTerm]);

        res.json({ success: true, data: products });
    }
};

module.exports = {
    getProducts,
    getProductById,
    searchProducts
};
