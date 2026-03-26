import React, { useState, useEffect } from "react";
import "./../styles/DocumentUploadModal.css";
import { useAuth } from "../services/auth/useAuth";
import TagSelector from "./TagSelector"; // assuming you created this component

const EditAgentModal = ({ agent, onClose, onAgentUpdated }) => {
  const { updateAgent, getTags, createTag } = useAuth();

  const [form, setForm] = useState({
    name: agent.name || "",
    description: agent.description || "",
    system_prompt: agent.system_prompt || "",
  });

  const [selectedTags, setSelectedTags] = useState(agent.tags_detail || []);
  const [loading, setLoading] = useState(false);

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
        tags: selectedTags.map((t) => t.id), // send only IDs
      };

      await updateAgent(agent.id, payload);

      toast.success(`${agent.name} updated!`);
      onAgentUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.err(err.message || "Update failed");
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

          {/* Tag Selector */}
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            getTags={getTags}       // fetch existing tags
            createTag={createTag}   // create new tags dynamically
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