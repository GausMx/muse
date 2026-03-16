import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => {
      setProduct(res.data);
      
      // Auto-select if there's only one option
      const productSizes = [...new Set(res.data.variants.map(v => v.size).filter(Boolean))];
      const productColors = [...new Set(res.data.variants.map(v => v.color).filter(Boolean))];
      
      if (productSizes.length === 1) setSelectedSize(productSizes[0]);
      if (productColors.length === 1) setSelectedColor(productColors[0]);
    });
  }, [slug]);

  if (!product) return (
    <div style={{ 
      fontFamily: "'Jost', sans-serif",
      background: "#322D29", 
      minHeight: "100vh", 
      color: "#EFE9E1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      letterSpacing: 3,
      textTransform: "uppercase",
    }}>
      Loading...
    </div>
  );

  // Handle products with no variants - create a default variant
  const hasVariants = product.variants && product.variants.length > 0;
  
  console.log('Product:', product.name);
  console.log('Has variants:', hasVariants);
  console.log('Variants array:', product.variants);
  
  // Get unique sizes and colors (filter out empty/null values)
  const sizes = hasVariants ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] : [];
  const colors = hasVariants ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] : [];

  console.log('Sizes:', sizes);
  console.log('Colors:', colors);

  // Find matching variant - handle cases where size or color might not exist
  let selectedVariant;
  
  if (!hasVariants) {
    // Create a virtual default variant for products without variants
    selectedVariant = {
      _id: 'default',
      price: product.basePrice || 0,
      stock: product.stock || 0, // Use product-level stock
      size: null,
      color: null
    };
    console.log('Created virtual variant:', selectedVariant);
  } else {
    selectedVariant = product.variants.find(v => {
      // If there are no sizes/colors at all, just return the first variant
      if (sizes.length === 0 && colors.length === 0) return true;
      
      // If only sizes exist, match by size
      if (sizes.length > 0 && colors.length === 0) {
        return v.size === selectedSize;
      }
      
      // If only colors exist, match by color
      if (colors.length > 0 && sizes.length === 0) {
        return v.color === selectedColor;
      }
      
      // If both exist, match both
      return v.size === selectedSize && v.color === selectedColor;
    });
    console.log('Selected variant:', selectedVariant);
  }

  // Determine if we can add to cart - simplified logic
  const canAddToCart = !!(selectedVariant && selectedVariant.stock > 0 && 
    (!sizes.length || selectedSize) && 
    (!colors.length || selectedColor));

  console.log('=== ADD TO CART DEBUG ===');
  console.log('selectedVariant:', selectedVariant);
  console.log('needsSize:', sizes.length > 0 && !selectedSize);
  console.log('needsColor:', colors.length > 0 && !selectedColor);
  console.log('canAddToCart:', canAddToCart);
  console.log('========================');

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    
    const cartItem = {
      productId: product._id,
      variantId: selectedVariant._id === 'default' ? null : selectedVariant._id,
      quantity,
      name: product.name,
      image: product.images?.[0],
      price: selectedVariant.price,
      size: selectedVariant.size,
      color: selectedVariant.color
    };

    if (user) {
      // Logged in - add to backend
      api.post('/cart', {
        productId: product._id,
        variantId: selectedVariant._id === 'default' ? null : selectedVariant._id,
        quantity
      }).then(() => {
        alert('Added to cart!');
      }).catch(err => {
        console.error('Add to cart error:', err);
        alert('Failed to add to cart');
      });
    } else {
      // Guest - save to localStorage
      try {
        const existingCart = localStorage.getItem('cart');
        let cart;
        
        if (existingCart) {
          try {
            cart = JSON.parse(existingCart);
            // Ensure cart has items array
            if (!cart.items || !Array.isArray(cart.items)) {
              cart = { items: [] };
            }
          } catch (parseErr) {
            console.error('Parse cart error:', parseErr);
            cart = { items: [] };
          }
        } else {
          cart = { items: [] };
        }
        
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(
          item => item.variantId === cartItem.variantId
        );
        
        if (existingItemIndex > -1) {
          // Update quantity
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          cart.items.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
      } catch (err) {
        console.error('LocalStorage cart error:', err);
        alert('Failed to add to cart');
      }
    }
  };

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: "#322D29",
      minHeight: "100vh",
      color: "#EFE9E1",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --charcoal: #322D29;
          --burgundy: #72383D;
          --taupe:    #AC9C8D;
          --sand:     #D1C7BD;
          --cream:    #EFE9E1;
        }

        .pdp-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(40px,8vw,80px) clamp(24px,6vw,60px);
        }

        .pdp-breadcrumb {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(172,156,141,0.5);
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pdp-breadcrumb a {
          color: var(--taupe);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .pdp-breadcrumb a:hover { color: var(--cream); }

        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px,8vw,80px);
        }

        @media (max-width: 900px) {
          .pdp-grid { grid-template-columns: 1fr; }
        }

        /* IMAGES */
        .pdp-images {
          position: sticky;
          top: 80px;
          align-self: start;
        }

        .pdp-main-image {
          aspect-ratio: 3/4;
          overflow: hidden;
          margin-bottom: 16px;
          background: rgba(0,0,0,0.2);
        }

        .pdp-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdp-thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .pdp-thumb {
          aspect-ratio: 3/4;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
          background: rgba(0,0,0,0.2);
        }

        .pdp-thumb:hover { border-color: rgba(172,156,141,0.4); }
        .pdp-thumb.active { border-color: var(--burgundy); }

        .pdp-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .pdp-thumb:hover img { transform: scale(1.05); }

        /* DETAILS */
        .pdp-title {
          font-size: clamp(32px,5vw,52px);
          font-weight: 300;
          letter-spacing: -0.5px;
          color: var(--cream);
          margin-bottom: 12px;
        }

        .pdp-category {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          margin-bottom: 24px;
        }

        .pdp-price {
          font-size: 28px;
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 8px;
        }

        .pdp-stock {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        .pdp-stock.in-stock { color: rgba(172,156,141,0.7); }
        .pdp-stock.out-of-stock { color: rgba(114,56,61,0.7); }

        .pdp-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(172,156,141,0.2), transparent);
          margin: 32px 0;
        }

        .pdp-desc {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.8;
          color: var(--sand);
          margin-bottom: 40px;
        }

        /* VARIANT SELECTORS */
        .pdp-option-group {
          margin-bottom: 24px;
        }

        .pdp-option-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          display: block;
          margin-bottom: 12px;
        }

        .pdp-option-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pdp-option-btn {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: var(--sand);
          background: transparent;
          border: 1px solid rgba(172,156,141,0.25);
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .pdp-option-btn:hover { border-color: var(--taupe); color: var(--cream); }
        .pdp-option-btn.active {
          background: var(--burgundy);
          border-color: var(--burgundy);
          color: var(--cream);
        }

        /* QUANTITY */
        .pdp-qty-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .pdp-qty-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
        }

        .pdp-qty-control {
          display: flex;
          align-items: center;
          border: 1px solid rgba(172,156,141,0.25);
        }

        .pdp-qty-btn {
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          color: var(--taupe);
          background: transparent;
          border: none;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pdp-qty-btn:hover { background: rgba(172,156,141,0.1); color: var(--cream); }
        .pdp-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .pdp-qty-value {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          color: var(--cream);
          width: 50px;
          text-align: center;
          border-left: 1px solid rgba(172,156,141,0.25);
          border-right: 1px solid rgba(172,156,141,0.25);
        }

        /* ADD TO CART */
        .pdp-add-btn {
          width: 100%;
          background: var(--burgundy);
          border: 1px solid var(--burgundy);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .pdp-add-btn:hover:not(:disabled) {
          background: transparent;
          border-color: var(--taupe);
          transform: translateY(-2px);
        }

        .pdp-add-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pdp-helper {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: rgba(172,156,141,0.5);
          margin-top: 12px;
          text-align: center;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="pdp-container">
        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <Link to="/">Home</Link>
          <span>→</span>
          <Link to="/products">Products</Link>
          <span>→</span>
          <span style={{ color: 'var(--cream)' }}>{product.name}</span>
        </div>

        <div className="pdp-grid">
          {/* IMAGES */}
          <div className="pdp-images">
            <div className="pdp-main-image">
              <img 
                src={product.images?.[selectedImage] ? `http://localhost:5000${product.images[selectedImage]}` : "https://placehold.co/600x800/322D29/AC9C8D?text=MUSE"}
                alt={product.name}
                onError={e => e.target.src = "https://placehold.co/600x800/322D29/AC9C8D?text=MUSE"}
              />
            </div>

            {product.images?.length > 1 && (
              <div className="pdp-thumbs">
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`pdp-thumb${selectedImage === i ? ' active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img 
                      src={`http://localhost:5000${img}`}
                      alt={`${product.name} ${i + 1}`}
                      onError={e => e.target.src = "https://placehold.co/300x400/322D29/AC9C8D?text=MUSE"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="pdp-details">
            <h1 className="pdp-title">{product.name}</h1>
            {product.category && (
              <p className="pdp-category">{product.category.name}</p>
            )}

            <div className="pdp-price">
              ₦{selectedVariant ? selectedVariant.price.toLocaleString() : product.basePrice?.toLocaleString()}
            </div>

            {selectedVariant && (
              <p className={`pdp-stock ${selectedVariant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {selectedVariant.stock > 0 
                  ? `${selectedVariant.stock} in stock` 
                  : 'Out of stock'
                }
              </p>
            )}

            <div className="pdp-divider" />

            {product.description && (
              <p className="pdp-desc">{product.description}</p>
            )}

            {/* SIZE SELECTOR */}
            {sizes.length > 0 && (
              <div className="pdp-option-group">
                <label className="pdp-option-label">Size</label>
                <div className="pdp-option-grid">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`pdp-option-btn${selectedSize === size ? ' active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLOR SELECTOR */}
            {colors.length > 0 && (
              <div className="pdp-option-group">
                <label className="pdp-option-label">Color</label>
                <div className="pdp-option-grid">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`pdp-option-btn${selectedColor === color ? ' active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            {selectedVariant && selectedVariant.stock > 0 && (
              <div className="pdp-qty-wrap">
                <span className="pdp-qty-label">Quantity</span>
                <div className="pdp-qty-control">
                  <button 
                    className="pdp-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="pdp-qty-value">{quantity}</span>
                  <button 
                    className="pdp-qty-btn"
                    onClick={() => setQuantity(q => Math.min(selectedVariant.stock, q + 1))}
                    disabled={quantity >= selectedVariant.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* ADD TO CART */}
            <button
              className="pdp-add-btn"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
            >
              {!canAddToCart && selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path d="M3 3h1.5l1.6 8h6.4l1.5-6H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="14" r="1" fill="currentColor"/>
                <circle cx="12" cy="14" r="1" fill="currentColor"/>
              </svg>
            </button>

            {!canAddToCart && selectedVariant?.stock > 0 && (needsSize || needsColor) && (
              <p className="pdp-helper">
                {needsSize && needsColor && "Please select a size and color"}
                {needsSize && !needsColor && "Please select a size"}
                {!needsSize && needsColor && "Please select a color"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}