import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, MapPin, ChevronUp, ChevronDown, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import './Cart.css';

function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, refreshCart } = useCart();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [showDiscounts, setShowDiscounts] = useState(true);
  const [address, setAddress] = useState({
    name: 'Vinay Kumar Chopra',
    phone: '9876543210',
    address: 'House no 143, Surabhi Store, Near Jalpan Hotel',
    city: 'DHING',
    state: 'Assam',
    pincode: '782123',
  });
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleQuantityChange = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQty);
    }
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const isAddressValid = () => {
    return address.name && address.phone && address.address &&
      address.city && address.state && address.pincode;
  };

  const handlePlaceOrder = async () => {
    if (!isAddressValid()) return;

    console.log('Placing order with address:', address);
    setPlacingOrder(true);
    try {
      const { data } = await ordersAPI.create(address);
      if (data.success) {
        setOrderSuccess(data.data);
        await refreshCart();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.error;
      if (typeof errorMessage === 'object') {
        alert(JSON.stringify(errorMessage));
      } else {
        alert(errorMessage || 'Failed to place order');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  // Get estimated delivery date
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="order-success">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: {orderSuccess.id}</p>
        <p>Total Amount: ₹{formatPrice(orderSuccess.total_amount)}</p>
        <div className="success-actions">
          <Link to="/orders" className="view-orders-btn">View Orders</Link>
          <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="Empty Cart" />
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
      </div>
    );
  }

  const mrpTotal = cart.items.reduce((sum, item) =>
    sum + (parseFloat(item.original_price || item.price) * item.quantity), 0
  );
  const discountTotal = mrpTotal - parseFloat(cart.summary.total);
  const platformFee = 7;

  return (
    <div className="cart-page">
      {/* Navigation Tabs */}
      <div className="cart-tabs">
        <div className="cart-tabs-container">
          <button className="cart-tab active">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" alt="" height="20" />
            Flipkart ({cart.summary.totalItems})
          </button>
          <button className="cart-tab">
            Grocery (1)
          </button>
        </div>
      </div>

      <div className="cart-container">
        {/* Left Section - Delivery & Items */}
        <div className="cart-left">
          {/* Delivery Address */}
          <div className="delivery-section">
            <div className="delivery-header">
              <span className="label">Deliver to:</span>
              <span className="name">{address.name}, {address.pincode}</span>
              <span className="badge">HOME</span>
              <button className="change-btn">Change</button>
            </div>
            <p className="address-text">{address.address}, {address.city}</p>
          </div>

          {/* Cart Items */}
          <div className="cart-items-section">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.product_id}`} className="item-image">
                  <img src={item.image_url} alt={item.name} />
                </Link>

                <div className="item-details">
                  <Link to={`/products/${item.product_id}`} className="item-name">
                    {item.name}
                  </Link>
                  <p className="item-variant">Finish Color - Wallnut, Pre Assembled</p>
                  <p className="seller-info">Seller: SpotRetail <span className="assured-badge">
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_9e47c1.png" alt="Assured" height="16" />
                  </span></p>

                  <div className="item-pricing">
                    {item.original_price && item.original_price > item.price && (
                      <span className="item-original">₹{formatPrice(item.original_price)}</span>
                    )}
                    <span className="item-price">₹{formatPrice(item.price)}</span>
                    {item.discount_percent > 0 && (
                      <span className="item-discount">{item.discount_percent}% Off</span>
                    )}
                  </div>

                  <p className="emi-text">Or Pay ₹{formatPrice(Math.round(item.price * item.quantity * 0.05))} + <span className="supercoins">○ {Math.round(item.price * item.quantity * 0.01)}</span></p>
                </div>

                <div className="item-delivery">
                  <p>Delivery by {getDeliveryDate()}</p>
                </div>

                <div className="item-actions-right">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      className="qty-btn"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      className="qty-btn"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Place Order Button */}
          <div className="cart-footer">
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>

        {/* Right Section - Price Details */}
        <div className="cart-right">
          <div className="price-details-card">
            <h3 className="price-title">Price details</h3>

            <div className="price-row">
              <span>MRP</span>
              <span>₹{formatPrice(mrpTotal)}</span>
            </div>

            <div className="price-row fees">
              <span>Fees <ChevronUp size={14} /></span>
              <span></span>
            </div>

            <div className="price-row sub-row">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <div className="price-row discounts" onClick={() => setShowDiscounts(!showDiscounts)}>
              <span>Discounts {showDiscounts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              <span></span>
            </div>

            {showDiscounts && (
              <div className="price-row sub-row discount-value">
                <span>Discount on MRP</span>
                <span className="green">− ₹{formatPrice(discountTotal)}</span>
              </div>
            )}

            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{formatPrice(parseFloat(cart.summary.total) + platformFee)}</span>
            </div>

            <div className="savings-box">
              <p>You will save ₹{formatPrice(discountTotal)} on this order</p>
            </div>

            <div className="safe-secure">
              <Shield size={16} />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
