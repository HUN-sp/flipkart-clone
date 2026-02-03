# Flipkart Clone Frontend

A React-based frontend for the Flipkart Clone e-commerce application.

## Features

- 🏠 **Home Page** - Category navigation, featured products, deal sections
- 🛍️ **Product Listing** - Filters (category, price, brand), sorting, pagination, grid/list view
- 📦 **Product Detail** - Full product info, specifications, add to cart
- 🛒 **Shopping Cart** - Add/remove items, quantity management, checkout
- 📋 **Order History** - View past orders, cancel orders

## Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **CSS** with Flipkart-style variables

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173`

## Prerequisites

Make sure the backend is running at `http://localhost:3000`

```bash
# In backend folder
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Top navigation
│   └── ProductCard.jsx # Product display card
├── context/
│   └── CartContext.jsx # Global cart state
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Products.jsx    # Product listing
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   └── Orders.jsx
├── services/
│   └── api.js          # API calls
├── styles/             # CSS files
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

## Flipkart Colors Used

```css
--headerBgColor: #2874f0;    /* Blue header */
--backgroundGrey: #f1f3f6;   /* Page background */
--green: #388e3c;            /* Ratings */
--offer-green: #008c00;      /* Discounts */
--brand-orange: #fb641b;     /* Buy button */
--orange: #ff9f00;           /* Cart button */
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Categories, featured products |
| Products | `/products` | Filtered product listing |
| Product | `/products/:id` | Single product details |
| Cart | `/cart` | Shopping cart & checkout |
| Orders | `/orders` | Order history |
