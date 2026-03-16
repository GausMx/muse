// components/ImageUploadPreview.jsx
import { useState } from "react";

export default function ImageUploadPreview({ onChange }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onChange(file); // send the file back to parent
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-40 h-40 object-cover rounded border"
        />
      )}
    </div>
  );
}
