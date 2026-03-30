import React, { useState, useEffect } from "react";
import "./../styles/DocumentUploadModal.css";
import { useAuth } from "../services/auth/useAuth";
import TagSelector from "./TagSelector";
import MultiSelectDropdown from "./MultiSelectDropdown";
import toast from "react-hot-toast";

const EditAgentModal = ({ agent, onClose, onAgentUpdated }) => {
  const { updateAgent, getTags, createTag, getDocs } = useAuth();

  const [form, setForm] = useState({
    name: agent.name || "",
    description: agent.description || "",
    system_prompt: agent.system_prompt || "",
  });

  const [selectedTags, setSelectedTags] = useState(agent.tags_detail || []);

  const [allDocuments, setAllDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState(
    agent.documents_detail?.map((d) => d.id) || []
  );

  const [loading, setLoading] = useState(false);

  // Fetch documents
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await getDocs();
        console.log("Fetched documents:", docs);
        setAllDocuments(docs.results || []);
        // TODO
        // Currently fetching only first page, change this to async search in backend and then multi select
        // Will create new page for editing agent, so not a big deal for now
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };

    fetchDocs();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        tags: selectedTags.map((t) => t.id),
        documents: selectedDocuments, // ✅ important
      };

      await updateAgent(agent.id, payload);

      toast.success(`${agent.name} updated!`);
      onAgentUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
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
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Edit Agent</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Agent Name"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <textarea
            name="system_prompt"
            value={form.system_prompt}
            onChange={handleChange}
            placeholder="System Prompt"
          />

          {/* Tags */}
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            getTags={getTags}
            createTag={createTag}
          />

          {/* Documents */}
          <MultiSelectDropdown
            options={allDocuments}
            selectedValues={selectedDocuments}
            onChange={setSelectedDocuments}
            placeholder="Select Documents"
            labelKey="name"
            valueKey="id"
          />

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Updating..." : "Update Agent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAgentModal;