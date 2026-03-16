import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { Link, useSearchParams } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [searchParams] = useSearchParams();

  const fetchProducts = () => {
    setLoaded(false);
    const params = {
      page,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
    };
    api.get("/products", { params }).then(res => {
      setProducts(res.data.products);
      setTotal(res.data.total);
      setTimeout(() => setLoaded(true), 80);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchParams]);

  const totalPages = Math.ceil(total / 10);
  const activeCategory = searchParams.get("category");
  const activeSearch   = searchParams.get("search");

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

        /* PAGE HEADER */
        .page-header {
          padding: clamp(60px,10vw,120px) clamp(24px,8vw,100px) clamp(40px,6vw,64px);
          border-bottom: 1px solid rgba(172,156,141,0.1);
          position: relative;
          overflow: hidden;
        }
        .page-header::before {
          content: '';
          position: absolute;
          top: -120px; right: -80px;
          width: 400px; height: 400px;
          border: 1px solid rgba(114,56,61,0.12);
          border-radius: 50%;
          pointer-events: none;
        }
        .page-header::after {
          content: '';
          position: absolute;
          top: -60px; right: -20px;
          width: 260px; height: 260px;
          border: 1px solid rgba(114,56,61,0.08);
          border-radius: 50%;
          pointer-events: none;
        }

        .page-kicker {
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 5px; text-transform: uppercase;
          color: var(--taupe);
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 16px;
          animation: fadeUp 0.8s ease forwards; opacity: 0;
        }
        .page-kicker::before {
          content: ''; display: block;
          width: 24px; height: 1px; background: var(--taupe);
        }

        .page-title {
          font-size: clamp(40px, 6vw, 80px);
          font-weight: 300; letter-spacing: -1px;
          color: var(--cream); line-height: 1.0;
          animation: fadeUp 0.8s ease 0.1s forwards; opacity: 0;
        }
        .page-title em { font-style: italic; color: var(--taupe); }

        .page-meta {
          font-family: 'Jost', sans-serif;
          font-size: 12px; font-weight: 300;
          color: rgba(172,156,141,0.55);
          margin-top: 14px; letter-spacing: 1px;
          animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0;
        }

        .active-filter {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(114,56,61,0.25);
          border: 1px solid rgba(114,56,61,0.4);
          color: var(--taupe);
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 3px; text-transform: uppercase;
          padding: 6px 14px;
          margin-top: 20px;
        }

        /* PRODUCTS GRID */
        .products-body {
          padding: clamp(40px,6vw,80px) clamp(24px,8vw,100px);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: rgba(172,156,141,0.1);
        }
        @media (max-width: 1200px) { .products-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 900px)  { .products-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px)  { .products-grid { grid-template-columns: 1fr; } }

        .product-tile {
          background: var(--charcoal);
          display: flex; flex-direction: column;
          text-decoration: none;
          overflow: hidden; position: relative;
        }

        .product-tile-img {
          aspect-ratio: 3/4;
          overflow: hidden; position: relative;
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

        .product-tile-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(50,45,41,0.85) 0%, transparent 55%);
          display: flex; align-items: flex-end;
          padding: 24px;
          opacity: 0; transition: opacity 0.4s ease;
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
          padding: 16px 18px;
          border-top: 1px solid rgba(172,156,141,0.08);
          display: flex; justify-content: space-between;
          align-items: baseline;
        }
        .product-tile-name {
          font-size: 15px; font-weight: 400;
          color: var(--cream); letter-spacing: 0.2px;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; max-width: 65%;
        }
        .product-tile-price {
          font-family: 'Jost', sans-serif;
          font-size: 13px; font-weight: 300;
          color: var(--taupe); letter-spacing: 1px;
          white-space: nowrap; margin-left: 8px;
        }

        /* EMPTY STATE */
        .empty-state {
          grid-column: 1 / -1;
          padding: 120px 40px;
          text-align: center;
          background: var(--charcoal);
        }
        .empty-icon {
          font-size: 40px;
          color: rgba(172,156,141,0.15);
          margin-bottom: 20px;
          font-style: italic;
        }
        .empty-title {
          font-size: 28px; font-weight: 300;
          color: rgba(239,233,225,0.3);
          margin-bottom: 10px;
        }
        .empty-sub {
          font-family: 'Jost', sans-serif;
          font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(172,156,141,0.3);
        }

        /* PAGINATION */
        .pagination {
          display: flex; align-items: center;
          justify-content: center; gap: 4px;
          margin-top: 64px; padding-bottom: 80px;
        }

        .page-btn {
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 2px; text-transform: uppercase;
          background: transparent;
          color: var(--taupe);
          border: 1px solid rgba(172,156,141,0.2);
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .page-btn:hover:not(:disabled) {
          background: rgba(114,56,61,0.2);
          border-color: var(--burgundy);
          color: var(--cream);
        }
        .page-btn:disabled {
          opacity: 0.25; cursor: not-allowed;
        }

        .page-numbers {
          display: flex; align-items: center; gap: 4px;
        }

        .page-num {
          font-family: 'Jost', sans-serif;
          font-size: 12px; font-weight: 300;
          background: transparent;
          color: rgba(172,156,141,0.5);
          border: 1px solid transparent;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }
        .page-num:hover { color: var(--cream); border-color: rgba(172,156,141,0.2); }
        .page-num.active {
          background: var(--burgundy);
          border-color: var(--burgundy);
          color: var(--cream);
        }

        .page-divider {
          width: 1px; height: 32px;
          background: rgba(172,156,141,0.15);
          margin: 0 8px;
        }

        .result-count {
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(172,156,141,0.4);
          letter-spacing: 2px; text-align: center;
          margin-top: 20px;
        }

        /* KEYFRAMES */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* PAGE HEADER */}
      <header className="page-header">
        <div className="page-kicker">
          {activeCategory ? "Category" : activeSearch ? "Search Results" : "Full Collection"}
        </div>
        <h1 className="page-title">
          {activeSearch ? (
            <>Results for <em>"{activeSearch}"</em></>
          ) : (
            <>Our <em>Collection</em></>
          )}
        </h1>
        <p className="page-meta">
          {total} {total === 1 ? "piece" : "pieces"} found
        </p>
        {(activeCategory || activeSearch) && (
          <div className="active-filter">
            <span>✦</span>
            <span>{activeSearch ? `"${activeSearch}"` : "Filtered by category"}</span>
          </div>
        )}
      </header>

      {/* PRODUCTS */}
      <div className="products-body">
        <div className="products-grid">
          {products.length > 0 ? products.map((product, i) => (
            <Link
              to={`/products/${product.slug}`}
              key={product._id}
              className="product-tile"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "none" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`,
              }}
            >
              <div className="product-tile-img">
                <img
                  src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "https://placehold.co/400x533/322D29/AC9C8D?text=MUSE"}
                  alt={product.name}
                  onError={e => e.target.src = "https://placehold.co/400x533/322D29/AC9C8D?text=MUSE"}
                />
                <div className="product-tile-overlay">
                  <span className="product-tile-cta">View Details →</span>
                </div>
              </div>
              <div className="product-tile-info">
                <span className="product-tile-name">{product.name}</span>
                <span className="product-tile-price">₦{product.basePrice?.toLocaleString()}</span>
              </div>
            </Link>
          )) : (
            <div className="empty-state">
              <p className="empty-icon">✦</p>
              <p className="empty-title">No pieces found</p>
              <p className="empty-sub">Try a different search or category</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div>
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                  <path d="M10 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Prev
              </button>

              <div className="page-divider" />

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "..." ? (
                      <span key={`ellipsis-${i}`} style={{
                        fontFamily: "'Jost', sans-serif",
                        color: "rgba(172,156,141,0.3)",
                        fontSize: 12, padding: "0 4px",
                      }}>…</span>
                    ) : (
                      <button
                        key={n}
                        className={`page-num${page === n ? " active" : ""}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    )
                  )
                }
              </div>

              <div className="page-divider" />

              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <p className="result-count">
              Page {page} of {totalPages} — {total} total pieces
            </p>
          </div>
        )}
      </div>
    </div>
  );
}