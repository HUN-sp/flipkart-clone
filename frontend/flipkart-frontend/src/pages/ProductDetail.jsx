import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ChevronRight, ChevronDown, MapPin, ThumbsUp, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [activeTab, setActiveTab] = useState('Specifications');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await productsAPI.getById(id);
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, 1);
      showToastNotification('Added to Cart Successfully!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.id, 1);
      showToastNotification('Added to Cart Successfully!');
      // Open cart in new tab after a brief delay
      setTimeout(() => {
        window.open('/cart', '_blank');
      }, 500);
    }
  };

  if (loading) {
    return <div className="pdp-loading"><div className="loader"></div></div>;
  }

  if (error || !product) {
    return (
      <div className="pdp-error">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="back-btn">Browse Products</Link>
      </div>
    );
  }

  const images = product.image_url ? [product.image_url] : ['https://via.placeholder.com/400'];
  const highlights = product.highlights || [];
  const specs = product.specifications || {};

  return (
    <div className="pdp-page">
      <div className="pdp-breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/products">Products</Link>
        <span className="sep">/</span>
        <Link to={`/products?category=${product.category_id}`}>{product.category_name || 'Category'}</Link>
        <span className="sep">/</span>
        <span className="current">{product.name?.slice(0, 50)}...</span>
      </div>

      <div className="pdp-container">
        {/* LEFT - Image Gallery */}
        <div className="pdp-left">
          <div className="pdp-gallery">
            <div className="pdp-thumbs">
              {images.map((img, idx) => (
                <div key={idx} className={`thumb ${selectedImage === idx ? 'active' : ''}`} onMouseEnter={() => setSelectedImage(idx)}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="pdp-image-main">
              <img src={images[selectedImage]} alt={product.name} />
              <div className="pdp-image-actions">
                <button className="icon-btn"><Heart size={20} /></button>
                <button className="icon-btn"><Share2 size={20} /></button>
              </div>
              <div className="pdp-image-rating">
                <span className="rating-badge">{product.rating || 4.0} ★</span>
                <span className="rating-text">| {(product.rating_count || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="pdp-cta">
            <button className="btn-cart" onClick={handleAddToCart}>
              <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/header_cart_v4-6ac9a8.svg" alt="" />
              ADD TO CART
            </button>
            <button className="btn-buy" onClick={handleBuyNow}>
              <img src="https://rukminim2.flixcart.com/www/24/24/promos/10/07/2023/fcf7afe9-14d8-4066-892a-fb4750a8ed2d.png?q=60" alt="" />
              BUY NOW
            </button>
          </div>
        </div>

        {/* RIGHT - Product Info */}
        <div className="pdp-right">
          <div className="pdp-brand">
            <span className="brand-name">{product.brand || 'Brand'}</span>
          </div>
          <h1 className="pdp-title">{product.name}</h1>
          <div className="pdp-rating-row">
            <span className="rating">{product.rating || 4.0} ★</span>
            <span className="rating-count">{(product.rating_count || 0).toLocaleString()} Ratings</span>
          </div>

          <div className="pdp-price">
            {product.discount_percent > 0 && <span className="disc-label">↓{product.discount_percent}%</span>}
            {product.original_price > product.price && <s className="orig-price">₹{formatPrice(product.original_price)}</s>}
            <span className="curr-price">₹{formatPrice(product.price)}</span>
          </div>

          <div className="pdp-offers">
            <div className="bank-offers">
              <p className="offers-title">Available offers</p>
              <ul style={{ padding: '10px 20px', fontSize: '14px' }}>
                <li>Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</li>
                <li>Bank Offer: 10% off up to ₹1,500 on Axis Bank Credit Card EMI</li>
                <li>Special Price: Get extra ₹{Math.round(product.price * 0.05)} off</li>
              </ul>
            </div>
          </div>

          <div className="pdp-delivery-box">
            <h3>Delivery details</h3>
            <div className="pincode-row">
              <MapPin size={18} />
              <input type="text" placeholder="Enter pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength="6" />
              <button className="check-btn">Check</button>
            </div>
            <div className="delivery-info">
              <p><strong>EXPRESS</strong> Delivery by Tomorrow</p>
              <p>Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            </div>
          </div>

          {highlights.length > 0 && (
            <div className="pdp-highlights-box">
              <h3>Highlights</h3>
              <ul style={{ padding: '10px 20px' }}>
                {highlights.map((h, i) => <li key={i} style={{ marginBottom: '8px' }}>{h}</li>)}
              </ul>
            </div>
          )}

          <div className="pdp-tabs-section">
            <h3>All details</h3>
            <div className="tabs">
              {['Specifications', 'Description'].map(tab => (
                <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="tab-content">
              {activeTab === 'Specifications' && (
                <div className="specs-list">
                  {Object.keys(specs).length > 0 ? (
                    Object.entries(specs).map(([key, val]) => (
                      <p key={key}><strong>{key}:</strong> {val}</p>
                    ))
                  ) : (
                    <p>No specifications available</p>
                  )}
                </div>
              )}
              {activeTab === 'Description' && (
                <div className="specs-list">
                  <p>{product.description || 'No description available'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <Check size={20} className="toast-icon" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;