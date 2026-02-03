import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star, Heart, Search } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [currentCategoryName, setCurrentCategoryName] = useState('Products');
  const [brands, setBrands] = useState([]);

  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    brand: true,
    discount: false,
    rating: false,
  });

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
        };

        if (currentSearch) params.search = currentSearch;
        if (currentCategory) params.category = currentCategory;
        if (currentBrand) params.brand = currentBrand;
        if (currentMinPrice) params.min_price = currentMinPrice;
        if (currentMaxPrice) params.max_price = currentMaxPrice;
        if (currentSort) params.sort = currentSort;

        const { data } = await productsAPI.getAll(params);

        if (data.success) {
          setProducts(data.data);
          setPagination(data.pagination);

          // Extract unique brands
          const uniqueBrands = [...new Set(data.data.map(p => p.brand).filter(Boolean))];
          setBrands(uniqueBrands);

          // Set category name
          if (currentSearch) {
            setCurrentCategoryName(currentSearch.charAt(0).toUpperCase() + currentSearch.slice(1));
          } else if (data.data.length > 0 && data.data[0].category_name) {
            setCurrentCategoryName(data.data[0].category_name);
          } else {
            setCurrentCategoryName('Products');
          }
        } else {
          setProducts([]);
          setPagination({ page: 1, totalPages: 1, total: 0 });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setPagination({ page: 1, totalPages: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentBrand, currentMinPrice, currentMaxPrice, currentSort, currentSearch, currentPage]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const toggleFilter = (filter) => {
    setExpandedFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  };

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {(currentCategory || currentBrand || currentMinPrice || currentMaxPrice || currentSearch) && (
              <button onClick={clearFilters} className="clear-filters">CLEAR ALL</button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleFilter('category')}>
              <span>CATEGORIES</span>
              {expandedFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.category && (
              <div className="filter-options">
                <div className="category-tree">
                  <Link to="/products?search=laptop" className={`category-link ${currentSearch === 'laptop' ? 'active' : ''}`}>Laptops</Link>
                  <Link to="/products?search=mobile" className={`category-link ${currentSearch === 'mobile' ? 'active' : ''}`}>Mobiles</Link>
                  <Link to="/products?search=furniture" className={`category-link ${currentSearch === 'furniture' ? 'active' : ''}`}>Furniture</Link>
                  <Link to="/products?search=beauty" className={`category-link ${currentSearch === 'beauty' ? 'active' : ''}`}>Beauty</Link>
                  <Link to="/products?search=sports" className={`category-link ${currentSearch === 'sports' ? 'active' : ''}`}>Sports</Link>
                  <Link to="/products?search=headphone" className={`category-link ${currentSearch === 'headphone' ? 'active' : ''}`}>Headphones</Link>
                </div>
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleFilter('price')}>
              <span>PRICE</span>
              {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.price && (
              <div className="filter-options">
                <div className="price-range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    className="price-input"
                    value={currentMinPrice}
                    onChange={(e) => updateFilter('min_price', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="price-input"
                    value={currentMaxPrice}
                    onChange={(e) => updateFilter('max_price', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleFilter('brand')}>
              <span>BRAND</span>
              {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.brand && (
              <div className="filter-options">
                {brands.map(brand => (
                  <label key={brand} className="filter-option checkbox">
                    <input
                      type="checkbox"
                      checked={currentBrand === brand}
                      onChange={() => updateFilter('brand', currentBrand === brand ? '' : brand)}
                    />
                    <span className="checkmark"></span>
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Discount Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleFilter('discount')}>
              <span>DISCOUNT</span>
              {expandedFilters.discount ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.discount && (
              <div className="filter-options">
                {['50% or more', '40% or more', '30% or more', '20% or more', '10% or more'].map(d => (
                  <label key={d} className="filter-option checkbox">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Customer Ratings */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleFilter('rating')}>
              <span>CUSTOMER RATINGS</span>
              {expandedFilters.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.rating && (
              <div className="filter-options">
                {['4★ & above', '3★ & above', '2★ & above'].map(r => (
                  <label key={r} className="filter-option checkbox">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Products Content */}
        <main className="products-content">
          <div className="products-topbar">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="separator">›</span>
              <span>{currentCategoryName}</span>
            </div>
            <div className="results-summary">
              <span className="results-text">
                Showing 1 – {products.length} of {pagination.total} results for "<strong>{currentSearch || currentCategoryName.toLowerCase()}</strong>"
              </span>
            </div>
            <div className="sort-tabs">
              <span className="sort-label">Sort By</span>
              <button className={currentSort === '' ? 'active' : ''} onClick={() => updateFilter('sort', '')}>Relevance</button>
              <button className={currentSort === 'popularity' ? 'active' : ''} onClick={() => updateFilter('sort', 'popularity')}>Popularity</button>
              <button className={currentSort === 'price_asc' ? 'active' : ''} onClick={() => updateFilter('sort', 'price_asc')}>Price -- Low to High</button>
              <button className={currentSort === 'price_desc' ? 'active' : ''} onClick={() => updateFilter('sort', 'price_desc')}>Price -- High to Low</button>
              <button className={currentSort === 'newest' ? 'active' : ''} onClick={() => updateFilter('sort', 'newest')}>Newest First</button>
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="products-loading"><div className="loader"></div></div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No results" />
              </div>
              <h2>Sorry, no results found!</h2>
              <p>We couldn't find products matching "<strong>{currentSearch || 'your search'}</strong>"</p>
              <p className="suggestion">Try: laptops, mobiles, beauty, sports, furniture, headphones</p>
              <div className="suggested-categories">
                <Link to="/products?search=laptop" className="suggested-btn">Laptops</Link>
                <Link to="/products?search=mobile" className="suggested-btn">Mobiles</Link>
                <Link to="/products?search=furniture" className="suggested-btn">Furniture</Link>
                <Link to="/products?search=beauty" className="suggested-btn">Beauty</Link>
              </div>
            </div>
          ) : (
            <div className="products-list-view">
              {products.map(product => (
                <Link to={`/products/${product.id}`} key={product.id} className="product-list-item">
                  <div className="pli-image">
                    <img src={product.image_url || 'https://via.placeholder.com/312'} alt={product.name} loading="lazy" />
                    <button className="wishlist-btn" onClick={(e) => e.preventDefault()}><Heart size={16} /></button>
                  </div>

                  <div className="pli-details">
                    <h3 className="pli-title">{product.name}</h3>
                    <div className="pli-rating">
                      <span className="rating-badge">
                        {product.rating || 4.0}
                        <Star size={12} fill="#fff" stroke="#fff" />
                      </span>
                      <span className="rating-count">{(product.rating_count || 0).toLocaleString()} Ratings</span>
                    </div>
                    <ul className="pli-specs">
                      {product.highlights && Array.isArray(product.highlights)
                        ? product.highlights.slice(0, 5).map((h, i) => <li key={i}>{h}</li>)
                        : <li>{product.description?.slice(0, 100) || 'Quality product'}</li>
                      }
                    </ul>
                  </div>

                  <div className="pli-pricing">
                    <div className="price-row">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {product.original_price > product.price && (
                        <>
                          <span className="original-price">{formatPrice(product.original_price)}</span>
                          <span className="discount-percent">{product.discount_percent}% off</span>
                        </>
                      )}
                    </div>
                    <div className="assured-badge">
                      <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_9e47c1.png" alt="Assured" height="21" />
                    </div>
                    {product.original_price > product.price && (
                      <div className="offer-row">
                        <span className="offer-text">Upto ₹{Math.round((product.original_price - product.price) * 0.8).toLocaleString()} Off on Exchange</span>
                      </div>
                    )}
                    <div className="offer-row bank"><span className="bank-offer">Bank Offer</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => updateFilter('page', (currentPage - 1).toString())}>Previous</button>
              <span className="page-info">Page {currentPage} of {pagination.totalPages}</span>
              <button disabled={currentPage === pagination.totalPages} onClick={() => updateFilter('page', (currentPage + 1).toString())}>Next</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;