import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
    api.get("/products", { params: { limit: 6 } }).then(res => {
      setFeatured(res.data.products);
      setTimeout(() => setLoaded(true), 100);
    });
  }, []);

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: "#322D29",
      minHeight: "100vh",
      color: "#EFE9E1",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --charcoal: #322D29;
          --burgundy: #72383D;
          --taupe:    #AC9C8D;
          --sand:     #D1C7BD;
          --cream:    #EFE9E1;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(40px, 8vw, 120px);
          position: relative;
          z-index: 2;
        }

        .hero-right {
          background: var(--burgundy);
          position: relative;
          overflow: hidden;
        }
        .hero-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 70%, rgba(172,156,141,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(50,45,41,0.4) 0%, transparent 50%);
        }
        .hero-right-pattern {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(45deg, transparent, transparent 40px,
              rgba(239,233,225,0.03) 40px, rgba(239,233,225,0.03) 41px),
            repeating-linear-gradient(-45deg, transparent, transparent 40px,
              rgba(239,233,225,0.03) 40px, rgba(239,233,225,0.03) 41px);
        }
        .hero-right-text {
          position: absolute;
          bottom: clamp(30px, 6vw, 80px);
          left: clamp(30px, 6vw, 60px);
          right: clamp(30px, 6vw, 60px);
        }
        .hero-right-quote {
          font-size: clamp(28px, 3.5vw, 50px);
          font-weight: 300;
          font-style: italic;
          color: rgba(239,233,225,0.18);
          line-height: 1.25;
          letter-spacing: 0.5px;
          user-select: none;
        }

        .kicker {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--taupe);
          margin-bottom: 22px;
          animation: fadeUp 0.9s ease forwards;
          opacity: 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .kicker::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--taupe);
        }

        .hero-title {
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -1px;
          color: var(--cream);
          animation: fadeUp 0.9s ease 0.15s forwards;
          opacity: 0;
        }
        .hero-title em {
          font-style: italic;
          color: var(--taupe);
          display: block;
        }

        .hero-desc {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: var(--sand);
          margin-top: 22px;
          line-height: 1.9;
          max-width: 360px;
          animation: fadeUp 0.9s ease 0.3s forwards;
          opacity: 0;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 28px;
          margin-top: 44px;
          animation: fadeUp 0.9s ease 0.45s forwards;
          opacity: 0;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--burgundy);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 16px 36px;
          text-decoration: none;
          border: 1px solid var(--burgundy);
          transition: all 0.35s ease;
        }
        .btn-primary:hover {
          background: transparent;
          border-color: var(--taupe);
          transform: translateY(-2px);
        }

        .btn-secondary {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          text-decoration: none;
          border-bottom: 1px solid rgba(172,156,141,0.35);
          padding-bottom: 3px;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .btn-secondary:hover { color: var(--cream); border-color: var(--cream); }

        /* MARQUEE */
        .marquee-strip {
          background: var(--burgundy);
          overflow: hidden;
          padding: 14px 0;
        }
        .marquee-track {
          display: flex;
          animation: marquee 22s linear infinite;
          white-space: nowrap;
        }
        .marquee-item {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(239,233,225,0.55);
          padding: 0 40px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 40px;
        }
        .marquee-item::after {
          content: '✦';
          font-size: 7px;
          color: rgba(239,233,225,0.2);
        }

        /* SECTION */
        .section {
          padding: clamp(60px,10vw,120px) clamp(24px,8vw,100px);
        }
        .section-header { margin-bottom: clamp(40px,6vw,64px); }

        .section-kicker {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--taupe);
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .section-kicker::before {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--taupe);
          display: block;
        }

        .section-title {
          font-size: clamp(32px,4.5vw,54px);
          font-weight: 300;
          color: var(--cream);
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .section-title em { font-style: italic; color: var(--taupe); }

        /* PRODUCT GRID */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 2px;
          background: rgba(172,156,141,0.1);
        }
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px)  { .products-grid { grid-template-columns: 1fr; } }

        .product-tile {
          background: var(--charcoal);
          display: flex;
          flex-direction: column;
          text-decoration: none;
          overflow: hidden;
          position: relative;
        }
        .product-tile-img {
          aspect-ratio: 3/4;
          overflow: hidden;
          position: relative;
        }
        .product-tile-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.9);
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease;
        }
        .product-tile:hover .product-tile-img img {
          transform: scale(1.06);
          filter: brightness(0.65);
        }
        .product-tile-badge {
          position: absolute; top: 16px; left: 16px;
          background: var(--burgundy);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 12px;
        }
        .product-tile-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(50,45,41,0.85) 0%, transparent 55%);
          display: flex; align-items: flex-end;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .product-tile:hover .product-tile-overlay { opacity: 1; }
        .product-tile-cta {
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--cream);
          border-bottom: 1px solid rgba(239,233,225,0.4);
          padding-bottom: 2px;
          transform: translateY(8px);
          transition: transform 0.4s ease 0.05s;
        }
        .product-tile:hover .product-tile-cta { transform: translateY(0); }

        .product-tile-info {
          padding: 16px 20px;
          border-top: 1px solid rgba(172,156,141,0.1);
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .product-tile-name {
          font-size: 16px; font-weight: 400;
          color: var(--cream); letter-spacing: 0.2px;
        }
        .product-tile-price {
          font-family: 'Jost', sans-serif;
          font-size: 13px; font-weight: 300;
          color: var(--taupe); letter-spacing: 1px;
          white-space: nowrap; margin-left: 12px;
        }

        /* CATS GRID */
        .cats-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 2px;
          background: rgba(172,156,141,0.1);
        }
        @media (max-width: 900px) { .cats-grid { grid-template-columns: repeat(2,1fr); } }

        .cat-tile {
          position: relative; overflow: hidden;
          text-decoration: none; aspect-ratio: 3/4; display: block;
        }
        .cat-tile img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(0.55);
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease;
        }
        .cat-tile:hover img { transform: scale(1.07); filter: brightness(0.32); }

        .cat-tile-body {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end;
          padding: 28px 20px;
        }
        .cat-tile-name {
          font-size: clamp(18px,2.5vw,26px);
          font-weight: 300; color: var(--cream);
          text-align: center; letter-spacing: 0.5px;
        }
        .cat-tile-name::after {
          content: '';
          display: block; width: 0; height: 1px;
          background: var(--taupe);
          margin: 10px auto 0;
          transition: width 0.4s ease;
        }
        .cat-tile:hover .cat-tile-name::after { width: 36px; }

        .cat-tile-link {
          font-family: 'Jost', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 4px; text-transform: uppercase;
          color: var(--taupe); margin-top: 10px;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
        }
        .cat-tile:hover .cat-tile-link { opacity: 1; transform: translateY(0); }

        .cat-no-img {
          background: linear-gradient(160deg, #3d3732 0%, var(--charcoal) 100%);
          border: 1px solid rgba(172,156,141,0.08);
          aspect-ratio: 3/4;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; text-decoration: none;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .cat-no-img::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, rgba(114,56,61,0.2) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .cat-no-img:hover { border-color: rgba(172,156,141,0.3); }
        .cat-no-img:hover::before { opacity: 1; }

        /* VIEW ALL */
        .view-all-wrap { margin-top: 48px; text-align: center; }
        .view-all {
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 4px; text-transform: uppercase;
          color: var(--taupe); text-decoration: none;
          border-bottom: 1px solid rgba(172,156,141,0.3);
          padding-bottom: 4px;
          transition: color 0.3s ease, border-color 0.3s ease;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .view-all:hover { color: var(--cream); border-color: var(--cream); }

        /* FOOTER STRIP */
        .bottom-strip {
          border-top: 1px solid rgba(172,156,141,0.1);
          padding: 44px clamp(24px,8vw,100px);
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 20px;
        }
        .strip-logo {
          font-size: 24px; font-weight: 300;
          letter-spacing: 10px; text-transform: uppercase;
          color: rgba(239,233,225,0.12);
        }
        .strip-links { display: flex; gap: 32px; }
        .strip-links a {
          font-family: 'Jost', sans-serif;
          font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(172,156,141,0.45);
          text-decoration: none; transition: color 0.3s ease;
        }
        .strip-links a:hover { color: var(--taupe); }

        .empty-state {
          text-align: center; padding: 80px 0;
          color: rgba(172,156,141,0.25);
          font-family: 'Jost', sans-serif;
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
        }

        /* KEYFRAMES */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="kicker">New Collection 2025</div>
          <h1 className="hero-title">
            Dressed in
            <em>Quiet Luxury</em>
          </h1>
          <p className="hero-desc">
            A curated collection of refined abayas and modest wear — designed for the woman who finds beauty in simplicity.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">
              Shop Collection
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/products" className="btn-secondary">Explore All</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-right-pattern" />
          {/* Decorative rings */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:"min(360px, 75%)", height:"min(360px, 75%)",
            border:"1px solid rgba(239,233,225,0.06)", borderRadius:"50%",
            pointerEvents:"none",
          }}>
            <div style={{ position:"absolute", inset:36, border:"1px solid rgba(239,233,225,0.04)", borderRadius:"50%" }}>
              <div style={{
                position:"absolute", inset:36,
                border:"1px solid rgba(239,233,225,0.03)", borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span style={{ fontSize:40, color:"rgba(239,233,225,0.07)", fontStyle:"italic" }}>M</span>
              </div>
            </div>
          </div>
          <div className="hero-right-text">
            <p className="hero-right-quote">"Style is a way<br/>to say who<br/>you are."</p>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {Array(14).fill(null).map((_, i) => (
            <span key={i} className="marquee-item">Free Worldwide Shipping</span>
          ))}
          {Array(14).fill(null).map((_, i) => (
            <span key={`b${i}`} className="marquee-item">New Arrivals Every Week</span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="section-header">
          <div className="section-kicker">Handpicked For You</div>
          <h2 className="section-title">Featured <em>Pieces</em></h2>
        </div>

        {featured.length > 0 ? (
          <>
            <div className="products-grid">
              {featured.map((product, i) => (
                <Link
                  to={`/products/${product.slug}`}
                  key={product._id}
                  className="product-tile"
                  style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "none" : "translateY(24px)",
                    transition: `opacity 0.7s ease ${i*0.09}s, transform 0.7s ease ${i*0.09}s`,
                  }}
                >
                  <div className="product-tile-img">
                    <img
                      src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : `https://placehold.co/400x533/322D29/AC9C8D?text=MUSE`}
                      alt={product.name}
                      onError={e => e.target.src = "https://placehold.co/400x533/322D29/AC9C8D?text=MUSE"}
                    />
                    {i === 0 && <span className="product-tile-badge">New</span>}
                    <div className="product-tile-overlay">
                      <span className="product-tile-cta">View Details →</span>
                    </div>
                  </div>
                  <div className="product-tile-info">
                    <span className="product-tile-name">{product.name}</span>
                    <span className="product-tile-price">₦{product.basePrice?.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="view-all-wrap">
              <Link to="/products" className="view-all">
                View All Products
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="empty-state">No products yet</p>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="section-kicker">Browse by Style</div>
          <h2 className="section-title">Shop by <em>Category</em></h2>
        </div>

        {categories.length > 0 ? (
          <div className="cats-grid">
            {categories.map(cat =>
              cat.image ? (
                <Link to={`/products?category=${cat._id}`} key={cat._id} className="cat-tile">
                  <img
                    src={`http://localhost:5000${cat.image}`}
                    alt={cat.name}
                    onError={e => e.target.src = "https://placehold.co/400x533/72383D/EFE9E1?text=MUSE"}
                  />
                  <div className="cat-tile-body">
                    <h3 className="cat-tile-name">{cat.name}</h3>
                    <span className="cat-tile-link">Explore →</span>
                  </div>
                </Link>
              ) : (
                <Link to={`/products?category=${cat._id}`} key={cat._id} className="cat-no-img">
                  <h3 style={{ fontSize:22, fontWeight:300, color:"var(--cream)", letterSpacing:1, textAlign:"center", position:"relative", zIndex:1 }}>
                    {cat.name}
                  </h3>
                  <span style={{
                    fontFamily:"'Jost', sans-serif", fontSize:9, fontWeight:500,
                    letterSpacing:4, textTransform:"uppercase", color:"var(--taupe)",
                    position:"relative", zIndex:1,
                  }}>Explore →</span>
                </Link>
              )
            )}
          </div>
        ) : (
          <p className="empty-state">No categories yet</p>
        )}
      </section>

      {/* BOTTOM STRIP */}
      <div className="bottom-strip">
        <span className="strip-logo">Muse</span>
        <div className="strip-links">
          <Link to="/products">Shop</Link>
          <Link to="/products">Collections</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </div>
    </div>
  );
}