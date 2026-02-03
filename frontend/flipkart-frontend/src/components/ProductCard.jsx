import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductCard.css';

function ProductCard({ product, variant = 'default' }) {
  const {
    id,
    name,
    price,
    original_price,
    discount_percent,
    image_url,
    rating,
    rating_count,
    brand
  } = product;

  const formatPrice = (p) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  if (variant === 'horizontal') {
    return (
      <Link to={`/products/${id}`} className="product-card-horizontal">
        <div className="pch-image">
          <img src={image_url} alt={name} />
        </div>
        <div className="pch-details">
          <h3 className="pch-title text-truncate-2">{name}</h3>
          {rating > 0 && (
            <div className="pch-rating">
              <span className="rating-badge">
                {rating} <Star size={12} fill="white" />
              </span>
              <span className="rating-count">({rating_count?.toLocaleString()})</span>
            </div>
          )}
          <ul className="pch-highlights">
            {product.highlights && JSON.parse(product.highlights).slice(0, 3).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
        <div className="pch-pricing">
          <span className="pch-price">{formatPrice(price)}</span>
          {original_price && original_price > price && (
            <>
              <span className="pch-original">{formatPrice(original_price)}</span>
              <span className="pch-discount">{discount_percent}% off</span>
            </>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="pc-image">
        <img src={image_url} alt={name} loading="lazy" />
      </div>
      <div className="pc-details">
        <p className="pc-brand">{brand}</p>
        <h3 className="pc-title text-truncate-2">{name}</h3>
        {rating > 0 && (
          <div className="pc-rating">
            <span className="rating-badge">
              {rating} <Star size={10} fill="white" />
            </span>
            <span className="rating-count">({rating_count?.toLocaleString()})</span>
          </div>
        )}
        <div className="pc-pricing">
          <span className="pc-price">{formatPrice(price)}</span>
          {original_price && original_price > price && (
            <>
              <span className="pc-original">{formatPrice(original_price)}</span>
              <span className="pc-discount">{discount_percent}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
