import React, { useState } from "react";
import "./../styles/DocumentUploadModal.css";
import { useAuth } from "../services/auth/useAuth";
import toast from "react-hot-toast";

const DocumentUploadModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { uploadDoc } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    try {
      setLoading(true);
      await uploadDoc(file);
      toast.success("File uploaded successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="modal-title">Upload Your Document</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <label className="file-label">
            {file ? file.name : "Choose a file"}
            <input
              type="file"
              accept=".pdf,.csv,.txt"
              onChange={handleFileChange}
            />
          </label>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;