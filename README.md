# Flipkart Clone Backend API

A complete e-commerce backend API built with Node.js, Express, and MySQL.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 3. Start server (auto-creates database & tables)
npm run dev

# 4. Seed sample data
npm run seed
```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/products/search/:query` | Search products |

**Query Parameters for GET /api/products:**
- `category` - Filter by category ID or name
- `brand` - Filter by brand name
- `min_price` - Minimum price
- `max_price` - Maximum price
- `search` - Search in name/description/brand
- `sort` - `price_asc`, `price_desc`, `rating`, `newest`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:id` | Get category with products |

### Cart
> **Note:** Requires `x-user-id` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders
> **Note:** Requires `x-user-id` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (checkout) |
| GET | `/api/orders` | Get order history |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/cancel` | Cancel order |

## Example Requests

### Get Products with Filters
```bash
curl "http://localhost:3000/api/products?category=Electronics&min_price=10000&sort=price_asc"
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{"product_id": 1, "quantity": 2}'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "shipping_address": {
      "name": "John Doe",
      "phone": "9876543210",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "payment_method": "COD"
  }'
```

## Test User
After seeding, use this user ID for testing:
```
x-user-id: test-user-123
```

## Tech Stack
- **Runtime:** Node.js v20
- **Framework:** Express.js
- **Database:** MySQL
- **Features:** Connection pooling, Transactions, Full-text search
