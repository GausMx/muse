import { useState, useEffect } from "react";
import api from "../../utils/api.js";

export default function ProductForm({ editing, onSuccess }) {
  const [form, setForm] = useState({ 
    name: "", 
    basePrice: "", 
    description: "", 
    category: "", // ✅ ADD
    variants: [] 
  });
  const [images, setImages] = useState([]); // ✅ Separate state for files
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ For dropdown

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => { 
    if (editing) {
      setForm({
        name: editing.name,
        basePrice: editing.basePrice,
        description: editing.description,
        category: editing.category?._id || editing.category,
        variants: editing.variants || []
      });
    }
  }, [editing]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("name", form.name);
    data.append("basePrice", form.basePrice);
    data.append("description", form.description);
    data.append("category", form.category); // ✅ ADD
    data.append("variants", JSON.stringify(form.variants)); // ✅ Stringify

    // Append images
    images.forEach(file => data.append("images", file));

    try {
      const url = editing ? `/admin/products/${editing._id}` : "/admin/products";
      const method = editing ? api.put : api.post;
      await method(url, data);
      onSuccess();
      setForm({ name: "", basePrice: "", description: "", category: "", variants: [] });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error("Product form error:", err.response?.data); // ✅ Log actual error
      alert(err.response?.data?.error || "Failed to save product");
    }
  };

  // ✅ Add variant management
  const addVariant = () => {
    setForm(f => ({
      ...f,
      variants: [...f.variants, { size: "", color: "", price: 0, stock: 0, sku: "" }]
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <input 
        name="name" 
        value={form.name} 
        onChange={handleChange} 
        placeholder="Product Name" 
        className="border p-2 w-full rounded"
        required
      />
      
      <input 
        name="basePrice" 
        type="number"
        value={form.basePrice} 
        onChange={handleChange} 
        placeholder="Base Price" 
        className="border p-2 w-full rounded"
        required
      />
      
      <select 
        name="category" 
        value={form.category} 
        onChange={handleChange} 
        className="border p-2 w-full rounded"
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <textarea 
        name="description" 
        value={form.description} 
        onChange={handleChange} 
        placeholder="Description" 
        className="border p-2 w-full rounded"
      />

      {/* Variants */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Variants</h3>
          <button type="button" onClick={addVariant} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
            + Add Variant
          </button>
        </div>
        
        {form.variants.map((variant, i) => (
          <div key={i} className="border p-3 rounded space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input 
                placeholder="Size" 
                value={variant.size}
                onChange={e => updateVariant(i, 'size', e.target.value)}
                className="border p-2 rounded"
              />
              <input 
                placeholder="Color" 
                value={variant.color}
                onChange={e => updateVariant(i, 'color', e.target.value)}
                className="border p-2 rounded"
              />
              <input 
                type="number"
                placeholder="Price" 
                value={variant.price}
                onChange={e => updateVariant(i, 'price', e.target.value)}
                className="border p-2 rounded"
              />
              <input 
                type="number"
                placeholder="Stock" 
                value={variant.stock}
                onChange={e => updateVariant(i, 'stock', e.target.value)}
                className="border p-2 rounded"
              />
              <input 
                placeholder="SKU (optional)" 
                value={variant.sku}
                onChange={e => updateVariant(i, 'sku', e.target.value)}
                className="border p-2 rounded col-span-2"
              />
            </div>
            <button 
              type="button" 
              onClick={() => removeVariant(i)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <input type="file" multiple onChange={handleImageChange} accept="image/*"/>
      <div className="flex gap-2">
        {imagePreviews.map((src, i) => (
          <img key={i} src={src} className="h-16 w-16 object-cover rounded"/>
        ))}
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
        {editing ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}