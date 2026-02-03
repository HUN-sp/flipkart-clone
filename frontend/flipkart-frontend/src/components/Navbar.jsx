import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

// Category menu items for the sub-navbar
const categoryMenuItems = [
  { name: 'Electronics', link: '/products?search=laptop' },
  { name: 'TVs & Appliances', link: '/products?search=furniture' },
  { name: 'Men', link: '/products?search=mobiles' },
  { name: 'Women', link: '/products?search=beauty' },
  { name: 'Baby & Kids', link: '/products' },
  { name: 'Home & Furniture', link: '/products?search=furniture' },
  { name: 'Sports, Books & More', link: '/products' },
  { name: 'Flights', link: '#' },
  { name: 'Offer Zone', link: '/products', isOffer: true },
];

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryBar, setShowCategoryBar] = useState(true);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on products/search page
  const isProductsPage = location.pathname.includes('/products');

  // Hide category bar on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setShowCategoryBar(false);
      } else {
        setShowCategoryBar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Blue navbar for products page (matches Flipkart exactly)
  if (isProductsPage) {
    return (
      <>
        {/* Fixed Blue Navbar */}
        <header className="navbar-blue">
          <div className="navbar-blue-container">
            {/* Flipkart Logo - Stacked with Join Plus */}
            <div className="fk-logo-section">
              <Link to="/" className="fk-logo-link">
                <img
                  width="75"
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png"
                  alt="Flipkart"
                  title="Flipkart"
                  className="fk-logo-img"
                />
              </Link>
              <a href="/plus" className="fk-plus-link">
                Join <span className="plus-yellow">Plus</span>
                <img
                  width="10"
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png"
                  alt=""
                />
              </a>
            </div>

            {/* Search Bar */}
            <form className="fk-search-form" onSubmit={handleSearch}>
              <div className="fk-search-wrapper">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="fk-search-input"
                  title="Search for products, brands and more"
                />
                <button type="submit" className="fk-search-btn">
                  <svg width="20" height="20" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#2874F1" fillRule="evenodd">
                      <path d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.02l-4.216-4.203"></path>
                      <path d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </form>

            {/* User Dropdown */}
            <div className="fk-nav-item">
              <span className="fk-nav-text">Vinay Kumar</span>
              <svg width="4.7" height="8" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg" className="fk-dropdown-arrow">
                <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="#fff"></path>
              </svg>
            </div>

            {/* Become a Seller */}
            <a href="https://seller.flipkart.com" className="fk-nav-link" target="_blank" rel="noopener noreferrer">
              <span>Become a Seller</span>
            </a>

            {/* More */}
            <div className="fk-nav-item">
              <span className="fk-nav-text">More</span>
              <svg width="4.7" height="8" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg" className="fk-dropdown-arrow">
                <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="#fff"></path>
              </svg>
            </div>

            {/* Cart */}
            <a href="/cart" target="_blank" rel="noopener noreferrer" className="fk-cart-link">
              <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" fill="#fff"></path>
              </svg>
              {cartCount > 0 && <span className="fk-cart-count">{cartCount}</span>}
              <span className="fk-nav-text">Cart</span>
            </a>
          </div>
        </header>

        {/* Category Menu Bar - Scrolls Away */}
        <div className={`category-menu-bar ${showCategoryBar ? 'visible' : 'hidden'}`}>
          <div className="category-menu-container">
            {categoryMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`category-menu-item ${item.isOffer ? 'offer-item' : ''}`}
              >
                {item.name}
                {!item.isOffer && (
                  <svg width="12" height="12" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg" className="cat-arrow">
                    <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="#212121"></path>
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Spacer for fixed navbar */}
        <div className="navbar-spacer"></div>
      </>
    );
  }

  // White navbar for homepage
  return (
    <>
      {/* Fixed Main Navbar */}
      <header className="navbar-white">
        <div className="navbar-white-container">
          {/* Flipkart Logo Button */}
          <Link to="/" className="navbar-logo-btn">
            <div className="logo-content">
              <img
                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fk-mp-c815b6.svg"
                alt="FLIPKART"
                className="flipkart-logo"
              />
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF80OTc0Xzc1OTY5KSI+CjxwYXRoIGQ9Ik0zIDJMNyA2TDExIDIiIHN0cm9rZT0iIzExMTExMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfNDk3NF83NTk2OSIgeD0iMC4yNSIgeT0iMC4yNSIgd2lkdGg9IjEzLjUiIGhlaWdodD0iOS44MTI1IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xNiAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzQ5NzRfNzU5NjkiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfNDk3NF83NTk2OSIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4K"
                alt="Chevron"
                width="12"
                height="12"
                className="logo-arrow"
              />
            </div>
          </Link>

          {/* Search Bar */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <button type="submit" className="search-icon" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>

          {/* Nav Actions */}
          <div className="navbar-actions">
            <div className="nav-item nav-user">
              <img
                src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-6bae67.svg"
                width="24"
                height="24"
                alt="Profile"
                className="user-icon"
              />
              <span className="nav-text">Vinay Kumar</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="chevron-icon">
                <path d="m6 9 6 6 6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="nav-item">
              <span className="nav-text">More</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="chevron-icon">
                <path d="m6 9 6 6 6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <a href="/cart" target="_blank" rel="noopener noreferrer" className="nav-item nav-cart">
              <div className="cart-icon-wrapper">
                <img
                  src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header_cart_v4-6ac9a8.svg"
                  alt="Cart"
                  width="24"
                  height="24"
                />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>
              <span className="nav-text">Cart</span>
            </a>
          </div>
        </div>

        {/* Location Bar - Only on Homepage */}
        <div className="location-bar">
          <div className="location-container">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="location-icon">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#000" />
            </svg>
            <span className="location-not-set">Location not set</span>
            <Link to="#" className="select-location-link">
              Select delivery location
              <svg width="16" height="16" fill="none" viewBox="0 0 17 17">
                <path d="m6.627 3.749 5 5-5 5" stroke="#1254E7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </Link>
          </div>
          <Link to="/supercoin" className="supercoins">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M21.015 13.811c0 5.04-4.035 8.879-9.015 8.879s-9.013-3.838-9.013-8.879c0-5.04 4.036-9.125 9.013-9.125s9.015 4.087 9.015 9.125Z" fill="#FFC30D"></path>
              <path d="M12 24C5.271 24 0 18.792 0 12.146 0 5.45 5.383 0 12 0c6.616 0 12 5.449 12 12.146C24 18.792 18.729 24 12 24Z" fill="#FD0"></path>
              <path d="m14.166 2.624-7.984 8.83c-1.028 1.137-.423 2.743 1.099 2.703l4.607.043a.42.42 0 0 1 .417.428.5.5 0 0 1-.014.11l-1.85 6.84 7.92-8.692c.992-1.089.23-2.853-1.236-2.853l-4.545.085a.422.422 0 0 1-.412-.545c.485-1.724 1.937-6.887 1.998-6.95Z" fill="#fff"></path>
            </svg>
            <span>0</span>
          </Link>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="navbar-spacer-home"></div>
    </>
  );
}

export default Navbar;