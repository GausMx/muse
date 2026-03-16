import { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    stock: "", // Stock for products without variants
    variants: [] // Empty by default - variants are optional
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchProducts = async () => {
    const res = await api.get("/admin/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description || "",
        category: editing.category?._id || "",
        basePrice: editing.basePrice || "",
        stock: editing.stock || "",
        variants: editing.variants || []
      });
      setShowForm(true);
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const addVariant = () => {
    setForm(f => ({
      ...f,
      variants: [...f.variants, { size: "", color: "", price: "", stock: "", sku: "" }]
    }));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm(f => ({ ...f, variants: updated }));
  };

  const removeVariant = (index) => {
    setForm(f => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only validate variants if they exist
    if (form.variants.length > 0) {
      const invalidVariant = form.variants.find(v => !v.price || (!v.stock && v.stock !== 0));
      if (invalidVariant) {
        alert("All variants must have a price and stock quantity");
        return;
      }
    }
    
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("basePrice", form.basePrice);
    data.append("stock", form.stock || 0); // Stock for products without variants
    data.append("variants", JSON.stringify(form.variants));
    images.forEach(file => data.append("images", file));

    try {
      const url = editing ? `/admin/products/${editing._id}` : "/admin/products";
      const method = editing ? api.put : api.post;
      await method(url, data);
      
      resetForm();
      fetchProducts();
      alert("Product saved successfully!");
    } catch (err) {
      console.error("Product save error:", err.response?.data);
      alert(err.response?.data?.error || "Failed to save product");
    }
  };

  const resetForm = () => {
    setForm({ 
      name: "", 
      description: "", 
      category: "", 
      basePrice: "",
      stock: "", // Reset stock
      variants: [] // Empty - variants are optional
    });
    setImages([]);
    setImagePreviews([]);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      background: "#322D29",
      minHeight: "100vh",
      color: "#EFE9E1",
      padding: "clamp(30px, 5vw, 60px)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=Jost:wght@200;300;400;500;600&display=swap');

        :root {
          --charcoal: #322D29;
          --burgundy: #72383D;
          --taupe:    #AC9C8D;
          --sand:     #D1C7BD;
          --cream:    #EFE9E1;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .admin-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 300;
          color: var(--cream);
        }

        .admin-btn {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: var(--burgundy);
          color: var(--cream);
          border: 1px solid var(--burgundy);
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .admin-btn:hover {
          background: transparent;
          border-color: var(--taupe);
        }

        .admin-btn-secondary {
          background: transparent;
          border-color: rgba(172,156,141,0.3);
          color: var(--taupe);
        }

        .admin-btn-secondary:hover {
          border-color: var(--taupe);
          color: var(--cream);
        }

        .admin-btn-danger {
          background: transparent;
          border-color: rgba(114,56,61,0.5);
          color: rgba(114,56,61,0.8);
        }

        .admin-btn-danger:hover {
          background: rgba(114,56,61,0.2);
          border-color: var(--burgundy);
          color: var(--cream);
        }

        .form-card {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: clamp(24px, 4vw, 40px);
          margin-bottom: 40px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          display: block;
          margin-bottom: 8px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: rgba(239,233,225,0.05);
          border: 1px solid rgba(172,156,141,0.2);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--burgundy);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .variant-card {
          background: rgba(114,56,61,0.1);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 20px;
          margin-bottom: 16px;
        }

        .variant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .variant-title {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--taupe);
        }

        .variant-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 600px) {
          .variant-grid { grid-template-columns: 1fr; }
        }

        .img-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .img-preview {
          aspect-ratio: 3/4;
          overflow: hidden;
          border: 1px solid rgba(172,156,141,0.2);
        }

        .img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
        }

        .products-table th {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--taupe);
          text-align: left;
          padding: 16px;
          border-bottom: 1px solid rgba(172,156,141,0.2);
        }

        .products-table td {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: var(--sand);
          padding: 16px;
          border-bottom: 1px solid rgba(172,156,141,0.1);
        }

        .products-table tbody tr:hover {
          background: rgba(172,156,141,0.05);
        }

        .action-btns {
          display: flex;
          gap: 8px;
        }

        .action-btns button {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 14px;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .btn-small {
          font-size: 10px;
          padding: 8px 16px;
        }
      `}</style>

      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Products</h1>
        <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Product"}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Classic Black Abaya"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Base Price</label>
                <input
                  name="basePrice"
                  type="number"
                  value={form.basePrice}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  required
                />
                <p style={{ 
                  fontFamily: "'Jost', sans-serif", 
                  fontSize: 10, 
                  color: 'rgba(172,156,141,0.5)', 
                  marginTop: 6,
                  letterSpacing: '0.5px'
                }}>
                  For products without variants. Variants have their own stock.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Product description..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
              {imagePreviews.length > 0 && (
                <div className="img-preview-grid">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="img-preview">
                      <img src={src} alt={`Preview ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <label className="form-label" style={{ margin: 0 }}>Variants (Optional)</label>
                  <p style={{ 
                    fontFamily: "'Jost', sans-serif", 
                    fontSize: 11, 
                    color: 'rgba(172,156,141,0.5)', 
                    marginTop: 4,
                    letterSpacing: '0.5px'
                  }}>
                    Add variants if product has different sizes, colors, or pricing
                  </p>
                </div>
                <button type="button" className="admin-btn btn-small" onClick={addVariant}>
                  + Add Variant
                </button>
              </div>

              {form.variants.map((variant, i) => (
                <div key={i} className="variant-card">
                  <div className="variant-header">
                    <span className="variant-title">Variant {i + 1}</span>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger btn-small"
                      onClick={() => removeVariant(i)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="variant-grid">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Size</label>
                      <input
                        placeholder="e.g., S, M, L, XL"
                        value={variant.size}
                        onChange={e => updateVariant(i, 'size', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Color</label>
                      <input
                        placeholder="e.g., Black, Navy, Beige"
                        value={variant.color}
                        onChange={e => updateVariant(i, 'color', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={variant.price}
                        onChange={e => updateVariant(i, 'price', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={variant.stock}
                        onChange={e => updateVariant(i, 'stock', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                      <label className="form-label">SKU (Optional)</label>
                      <input
                        placeholder="e.g., ABY-BLK-M-001"
                        value={variant.sku}
                        onChange={e => updateVariant(i, 'sku', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="submit" className="admin-btn">
                {editing ? "Update Product" : "Create Product"}
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Base Price</th>
            <th>Variants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td style={{ fontWeight: 500, color: 'var(--cream)' }}>{p.name}</td>
              <td>{p.category?.name || "—"}</td>
              <td>₦{p.basePrice}</td>
              <td>{p.variants.length}</td>
              <td>
                <div className="action-btns">
                  <button
                    onClick={() => setEditing(p)}
                    className="admin-btn admin-btn-secondary btn-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="admin-btn admin-btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(172,156,141,0.3)',
        }}>
          No products yet
        </div>
      )}
    </div>
  );
}