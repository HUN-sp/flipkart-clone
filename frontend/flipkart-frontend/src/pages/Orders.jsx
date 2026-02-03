import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, XCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.getAll({ limit: 20 });
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setCancellingId(orderId);
    try {
      const { data } = await ordersAPI.cancel(orderId);
      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <Package size={80} strokeWidth={1} />
        <h2>No orders yet</h2>
        <p>Looks like you haven't placed any orders</p>
        <Link to="/products" className="shop-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <span>{orders.length} orders</span>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Order #{order.id.slice(0, 8)}...</span>
                  <span className="order-date">{formatDate(order.created_at)}</span>
                </div>
                <div className="order-meta">
                  <span className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <span className="order-total">{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="oi-image">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <div className="oi-details">
                      <p className="oi-name text-truncate">{item.name}</p>
                      <p className="oi-meta">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="more-items">
                    +{order.items.length - 3} more item(s)
                  </p>
                )}
              </div>

              {order.shipping_address && (
                <div className="order-address">
                  <span className="address-label">Delivery Address:</span>
                  <span className="address-text">
                    {order.shipping_address.name}, {order.shipping_address.address}, 
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </span>
                </div>
              )}

              <div className="order-actions">
                {['pending', 'confirmed'].includes(order.status) && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    <XCircle size={16} />
                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
                <Link to={`/products`} className="reorder-btn">
                  Shop Again <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
