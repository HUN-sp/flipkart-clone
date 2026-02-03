import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, productsAPI } from '../services/api';
import './Home.css';

// Actual Flipkart carousel images
const carouselSlides = [
  { id: 0, image: 'https://rukminim2.flixcart.com/fk-p-flap/1580/770/image/8002da75c968ffd1.jpg', link: '/products', alt: 'Jewellery' },
  { id: 1, image: 'https://rukminim2.flixcart.com/fk-p-flap/1580/770/image/60cbf7ad1d2693cf.png', link: '/products', alt: 'Vivo X200T' },
  { id: 2, image: 'https://rukminim2.flixcart.com/fk-p-flap/1580/770/image/000ecda8fc68da64.png', link: '/products', alt: 'Moto Watch' },
  { id: 3, image: 'https://rukminim2.flixcart.com/fk-p-flap/1580/770/image/6aaeb0a71d6c23d6.png', link: '/products', alt: 'Realme P4' },
  { id: 4, image: 'https://rukminim2.flixcart.com/fk-p-flap/1580/770/image/7c4897bf544793c1.jpg', link: '/products', alt: 'Computer' },
  { id: 5, image: 'https://rukminim2.flixcart.com/fk-p-flap/1580/770/image/94f1283b56a52b59.png', link: '/products', alt: 'Samsung' },
];

// Category icons - Row 1
const categoryIcons = [
  { name: 'Flipkart Minutes', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/29327f40e9c4d26b.png?q=90', tag: '10 Mins', isSpecial: true },
  { name: 'Mobiles', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/a6189afdd765a687.jpg?q=90' },
  { name: 'Food & Health', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/f9ebd80a4825f28e.jpg?q=90' },
  { name: 'Appliances', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/51b0d5f9aabc2462.jpg?q=90' },
  { name: 'Beauty', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/d31d524f681630af.jpg?q=90' },
  { name: 'Furniture', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/9be859f78d39cc22.jpg?q=90' },
  { name: 'Sports', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/c632b839ac6d183e.jpg?q=90' },
  { name: 'GenZ Trends', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/e1b4ec56637b0ac0.jpg?q=90' },
  { name: 'Next Gen', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/c7f57c3d9a547417.jpg?q=90' },
];

// Category icons - Row 2
const categoryIconsRow2 = [
  { name: 'Grocery', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/050d2cfd58ff4b44.jpg?q=90' },
  { name: 'Fashion', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/5dca7713b355df43.jpg?q=90' },
  { name: 'Travel', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/d7eae409dc461a54.jpg?q=90' },
  { name: 'Electronics', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/a080ac3397f3612d.png?q=90' },
  { name: 'Home & kitchen', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/506347d817d14025.jpg?q=90' },
  { name: 'Auto Acc', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/d4d87d1307cd2a29.jpg?q=90' },
  { name: 'Toys, Baby...', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/be8bdab4e494e3b8.jpg?q=90' },
  { name: 'Sell Phone', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/38e2f5617d0edd27.png?q=90', isBlue: true },
  { name: 'Flipkart Pay', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/c7f57c3d9a547417.jpg?q=90', isYellow: true },
  { name: 'SuperCoin', icon: 'https://rukminim2.flixcart.com/fk-p-flap/178/178/image/e476bbcf4677c695.jpg?q=90', isOrange: true },
];

// Personalized "Still looking" products
const personalizedProducts = [
  { id: 1, name: 'Mobiles', image: 'https://rukminim2.flixcart.com/image/180/180/xif0q/mobile/1/k/r/-original-imahhqjwsngwkksu.jpeg?q=60' },
  { id: 2, name: 'Laptops', image: 'https://rukminim2.flixcart.com/image/180/180/xif0q/computer/a/g/p/-original-imahgwkqughzkwt3.jpeg?q=60' },
  { id: 3, name: 'Packaged Sweets', image: 'https://rukminim2.flixcart.com/image/180/180/xif0q/sweet-mithai/w/h/d/400-gond-dryfruit-ladoo-for-post-pregnency-box-400-g-1-laddu-lkm-original-imagn6hh8xbzqzgb.jpeg?q=60' },
];

// Small deals cards (shoes, watches, earbuds)
const smallDeals = [
  { id: 1, name: 'Casual Shoes', price: '₹10,149', image: 'https://rukminim2.flixcart.com/fk-p-flap/100/130/image/9bfb4ba26d196ec6.png?q=90', offer: 'Min. 80% Off' },
  { id: 2, name: 'WakeFit', price: '₹2,499', image: 'https://rukminim2.flixcart.com/fk-p-flap/100/130/image/74404e3f5cd02876.png?q=90', offer: 'Min. 50% Off' },
  { id: 3, name: 'Just Landed', price: '₹599', image: 'https://rukminim2.flixcart.com/fk-p-flap/100/130/image/65be10063ad54ca1.png?q=90', offer: 'On Sale Now' },
];

// Suggested laptops
const suggestedLaptops = [
  { id: 1, name: 'ASUS Vivobook Go 15', price: 53990, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/computer/a/g/p/-original-imahgwkqughzkwt3.jpeg?q=60' },
  { id: 2, name: 'Lenovo IdeaPad Slim 3', price: 52990, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/computer/q/t/k/-original-imahgx8wzexjwf68.jpeg?q=60' },
  { id: 3, name: 'DELL 15 Intel Core i5', price: 51290, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/computer/j/n/w/-original-imahg5fur7csf5kn.jpeg?q=60' },
  { id: 4, name: 'HP 15s AMD Ryzen 5', price: 49990, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/computer/9/u/w/-original-imahf69hwz6gnedj.jpeg?q=60' },
  { id: 5, name: 'Samsung Galaxy Book4', price: 70800, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/computer/y/e/a/-original-imahgfdfznbvqjyv.jpeg?q=60' },
  { id: 6, name: 'ASUS E1504FA', price: 37990, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/computer/m/f/w/e1504fa-nj549ws-thin-and-light-laptop-asus-original-imah3877hyhrxp43.jpeg?q=60' },
];

// Gadgets & Appliances deals
const gadgetsDeals = [
  { id: 1, name: 'Smartwatch', offer: 'Min. 90% Off', image: 'https://rukminim2.flixcart.com/fk-p-flap/220/300/image/f9e7def0f00c2252.png?q=60' },
  { id: 2, name: 'Wireless Earbuds', offer: 'Just ₹599', image: 'https://rukminim2.flixcart.com/fk-p-flap/220/300/image/407490de13e46ecb.png?q=60' },
  { id: 3, name: 'boAt Watch', offer: 'Launch 6th Feb', image: 'https://rukminim2.flixcart.com/fk-p-flap/220/300/image/1ec1dfbb74ba5811.png?q=60' },
  { id: 4, name: 'Headphones', offer: 'Spl. price ₹899', image: 'https://rukminim2.flixcart.com/fk-p-flap/220/300/image/e55a0b33d3b2b103.png?q=60' },
  { id: 5, name: 'Speakers', offer: 'Min. 50% Off', image: 'https://rukminim2.flixcart.com/fk-p-flap/220/300/image/be06dcf2d8e0c518.png?q=60' },
];

// Smartphones
const smartphones = [
  { id: 1, name: 'iPhone 16 Pro', price: 119900, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/mobile/z/u/l/-original-imahhqjwyzsjyfvn.jpeg?q=90' },
  { id: 2, name: 'Samsung S24 Ultra', price: 124999, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/mobile/o/z/v/-original-imahgqnz4yfxfz8k.jpeg?q=90' },
  { id: 3, name: 'Motorola G35 5G', price: 10999, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/mobile/o/v/c/g35-5g-pb3h0001in-motorola-original-imah7c6xqfsptyzx.jpeg?q=90' },
  { id: 4, name: 'OnePlus Nord CE4', price: 24999, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/mobile/0/7/s/-original-imahgy26hqbqjfgb.jpeg?q=90' },
  { id: 5, name: 'Motorola Edge 50', price: 27999, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/mobile/o/m/y/edge-50-pb2w0002in-motorola-original-imah3ancahezgjzh.jpeg?q=90' },
  { id: 6, name: 'Realme 12 Pro', price: 23999, image: 'https://rukminim2.flixcart.com/image/200/260/xif0q/mobile/p/o/i/-original-imah4kfuzzxz6tvn.jpeg?q=90' },
];

// Beauty, Food, Toys section
const beautyFoodToys = [
  { id: 1, name: 'Graphics Card', price: 29999, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/graphics-card/u/e/7/-original-imagrfry9ub4zx7m.jpeg?q=90' },
  { id: 2, name: 'Sandals', price: 999, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/sandal/f/9/l/10-waker-maan-brown-original-imah85zhn4yvcbfp.jpeg?q=90' },
  { id: 3, name: 'Dry Fruits', price: 599, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/nut-dry-fruit/c/f/6/500-mixed-dry-fruits-1-plastic-bottle-dailyherbs-original-imah76qeztymbwce.jpeg?q=90' },
  { id: 4, name: 'Deodorant', price: 299, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/deodorant/j/8/c/400-polar-breeze-mystic-bloom-deodorant-combo-2x200ml-long-original-imahegxfhhs9yxwt.jpeg?q=90' },
];

// Top Selection
const topSelection = [
  { id: 1, name: 'Insole', price: 199, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/support/r/3/d/left-foot-and-right-foot-silicone-insole-height-increase-insole-original-imahd8bbafakghuw.jpeg?q=90' },
  { id: 2, name: 'Keyboard Mouse', price: 599, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/laptop-accessories-combo/q/1/s/set-of-5-combo-usb-wired-keyboard-wire-mouse-mouse-pad-typec-original-imahcfejhg9zkk4e.jpeg?q=90' },
  { id: 3, name: 'Motorola G85', price: 17999, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/mobile/x/v/z/-original-imah28xpzzwz4fwg.jpeg?q=90' },
  { id: 4, name: 'Shorts', price: 399, image: 'https://rukminim2.flixcart.com/image/280/374/xif0q/short/l/d/8/xl-fhp-blk-a-grey-s-flyzen-original-imahjrfgtujfyvnx.jpeg?q=90' },
];

function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await categoriesAPI.getAll();
        if (catRes?.data?.success) setCategories(catRes.data.data);
        const prodRes = await productsAPI.getAll({ limit: 8, sort: 'rating' });
        if (prodRes?.data?.success) setFeaturedProducts(prodRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const visibleSlides = 2.5;
  const maxSlide = carouselSlides.length - Math.floor(visibleSlides);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [maxSlide]);

  const slidePercentage = (100 / visibleSlides) * currentSlide;

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Carousel */}
      <section className="hero-carousel">
        <div className="carousel-wrapper">
          <div className="carousel-track" style={{ transform: `translateX(-${slidePercentage}%)` }}>
            {carouselSlides.map((slide) => (
              <div key={slide.id} className="carousel-slide-item">
                <Link to={slide.link}>
                  <img src={slide.image} alt={slide.alt} className="slide-image" />
                </Link>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="category-icons-section">
        <div className="category-icons-grid">
          {categoryIcons.map((cat, index) => (
            <Link to="/products" key={index} className={`category-icon-item ${cat.isSpecial ? 'special' : ''}`}>
              <div className="category-icon-wrapper">
                <img src={cat.icon} alt={cat.name} />
                {cat.tag && <span className="category-tag">{cat.tag}</span>}
              </div>
              <span className="category-icon-name">{cat.name}</span>
            </Link>
          ))}
        </div>
        <div className="category-icons-grid row2">
          {categoryIconsRow2.map((cat, index) => (
            <Link
              to="/products"
              key={index}
              className={`category-icon-item ${cat.isBlue ? 'blue-bg' : ''} ${cat.isYellow ? 'yellow-bg' : ''} ${cat.isOrange ? 'orange-bg' : ''}`}
            >
              <div className="category-icon-wrapper">
                <img src={cat.icon} alt={cat.name} />
              </div>
              <span className="category-icon-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Still Looking For These */}
      <section className="personalized-section">
        <div className="section-container">
          <h2 className="section-title">Vinay Kumar, still looking for these?</h2>
          <div className="personalized-products">
            {personalizedProducts.map((product) => (
              <Link to="/products" key={product.id} className="personalized-item">
                <div className="personalized-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <span className="personalized-name">{product.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Small Deals Cards */}
      <section className="small-deals-section">
        <div className="small-deals-container">
          {smallDeals.map((deal) => (
            <Link to="/products" key={deal.id} className="small-deal-card">
              <img src={deal.image} alt={deal.name} className="small-deal-image" />
              <div className="small-deal-info">
                <h4>{deal.name}</h4>
                <span className="small-deal-price">{deal.price}</span>
                <span className="small-deal-offer">{deal.offer}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Suggested For You - Laptops */}
      <section className="suggested-section">
        <div className="section-container">
          <h2 className="section-title">Suggested For You</h2>
          <div className="suggested-grid">
            {suggestedLaptops.map((laptop) => (
              <Link to="/products" key={laptop.id} className="suggested-card">
                <img src={laptop.image} alt={laptop.name} />
                <div className="suggested-info">
                  <h4>{laptop.name}</h4>
                  <span className="suggested-price">From ₹{laptop.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Smartphones Section */}
      <section className="smartphones-section">
        <div className="section-container">
          <h2 className="section-title">Smartphone For You</h2>
          <div className="smartphones-grid">
            {smartphones.map((phone) => (
              <Link to="/products" key={phone.id} className="smartphone-card">
                <img src={phone.image} alt={phone.name} />
                <div className="smartphone-info">
                  <h4>{phone.name}</h4>
                  <span className="smartphone-price">₹{phone.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Gadgets & Appliances */}
      <section className="deals-section">
        <div className="section-container">
          <h2 className="section-title">Best Gadgets & Appliances</h2>
          <div className="deals-grid">
            {gadgetsDeals.map((product) => (
              <Link to="/products" key={product.id} className="deal-card">
                <img src={product.image} alt={product.name} className="deal-image-full" />
                <div className="deal-info">
                  <h4>{product.name}</h4>
                  <span className="deal-offer">{product.offer}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beauty, Food, Toys & more */}
      <section className="beauty-food-section">
        <div className="section-container">
          <h2 className="section-title">Beauty, Food, Toys & more</h2>
          <div className="beauty-food-grid">
            {beautyFoodToys.map((item) => (
              <Link to="/products" key={item.id} className="beauty-food-card">
                <img src={item.image} alt={item.name} />
                <div className="beauty-food-info">
                  <h4>{item.name}</h4>
                  <span className="beauty-food-price">From ₹{item.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selection */}
      <section className="top-selection-section">
        <div className="section-container">
          <h2 className="section-title">Top Selection</h2>
          <div className="top-selection-grid">
            {topSelection.map((item) => (
              <Link to="/products" key={item.id} className="top-selection-card">
                <img src={item.image} alt={item.name} />
                <div className="top-selection-info">
                  <h4>{item.name}</h4>
                  <span className="top-selection-price">From ₹{item.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Icons Again (Bottom) */}
      <section className="category-icons-section bottom-icons">
        <div className="category-icons-grid">
          {categoryIcons.slice(0, 8).map((cat, index) => (
            <Link to="/products" key={index} className="category-icon-item">
              <div className="category-icon-wrapper">
                <img src={cat.icon} alt={cat.name} />
              </div>
              <span className="category-icon-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>© 2024 Flipkart Clone - Built for learning purposes</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;