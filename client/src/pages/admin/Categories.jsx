import { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!name) {
      alert("Please enter a category name");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
          --taupe: #AC9C8D;
          --sand: #D1C7BD;
          --cream: #EFE9E1;
        }

        .cat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .cat-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 300;
          color: var(--cream);
        }

        .cat-btn {
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

        .cat-btn:hover {
          background: transparent;
          border-color: var(--taupe);
        }

        .cat-btn-secondary {
          background: transparent;
          border-color: rgba(172,156,141,0.3);
          color: var(--taupe);
        }

        .cat-btn-secondary:hover {
          border-color: var(--taupe);
          color: var(--cream);
        }

        .cat-btn-danger {
          background: transparent;
          border-color: rgba(114,56,61,0.5);
          color: rgba(114,56,61,0.8);
          font-size: 10px;
          padding: 6px 14px;
        }

        .cat-btn-danger:hover {
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

        .form-input {
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

        .form-input:focus {
          border-color: var(--burgundy);
        }

        .img-preview {
          width: 100%;
          max-width: 200px;
          aspect-ratio: 3/4;
          overflow: hidden;
          border: 1px solid rgba(172,156,141,0.2);
          margin-top: 12px;
        }

        .img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .cat-card {
          background: rgba(50,45,41,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(172,156,141,0.15);
          padding: 20px;
          transition: border-color 0.3s ease;
        }

        .cat-card:hover {
          border-color: rgba(172,156,141,0.3);
        }

        .cat-card-img {
          aspect-ratio: 3/4;
          overflow: hidden;
          margin-bottom: 16px;
          background: rgba(0,0,0,0.2);
        }

        .cat-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-card-name {
          font-size: 20px;
          font-weight: 300;
          color: var(--cream);
          margin-bottom: 12px;
        }
      `}</style>

      {/* Header */}
      <div className="cat-header">
        <h1 className="cat-title">Categories</h1>
        <button className="cat-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Category"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-card">
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              placeholder="e.g., Everyday Abayas"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
            {imagePreview && (
              <div className="img-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleAdd} className="cat-btn">
              Add Category
            </button>
            <button onClick={() => {
              setShowForm(false);
              setName("");
              setImage(null);
              setImagePreview(null);
            }} className="cat-btn cat-btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="cat-grid">
          {categories.map(cat => (
            <div key={cat._id} className="cat-card">
              {cat.image && (
                <div className="cat-card-img">
                  <img
                    src={`http://localhost:5000${cat.image}`}
                    alt={cat.name}
                    onError={e => e.target.src = "https://placehold.co/300x400/322D29/AC9C8D?text=MUSE"}
                  />
                </div>
              )}
              <h3 className="cat-card-name">{cat.name}</h3>
              <button
                onClick={() => handleDelete(cat._id)}
                className="cat-btn cat-btn-danger"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(50,45,41,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(172,156,141,0.15)',
          padding: 80,
          textAlign: 'center',
          fontFamily: "'Jost', sans-serif",
          fontSize: 12,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(172,156,141,0.4)',
        }}>
          No categories yet
        </div>
      )}
    </div>
  );
}