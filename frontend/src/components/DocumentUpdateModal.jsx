import React, { useState, useEffect } from "react";
import { useAuth } from "../services/auth/useAuth";

export default function DocumentUpdateModal({ doc, onClose, onSuccess }) {
  const { updateDoc } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    version: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  // Prefill data when modal opens
  useEffect(() => {
    if (doc) {
      setFormData({
        name: doc.name || "",
        version: doc.version || "",
        file: null,
      });
    }
  }, [doc]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("document_id", doc.id);
      payload.append("name", formData.name);
      payload.append("version", formData.version);

      if (formData.file) {
        payload.append("file", formData.file);
      }

      await updateDoc(payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  if (!doc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Update Document</h2>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Version */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Version</label>
          <input
            name="version"
            type="number"
            value={formData.version}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            min={1}
          />
        </div>

        {/* File */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Replace File</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-gray-900 text-white rounded-md"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}