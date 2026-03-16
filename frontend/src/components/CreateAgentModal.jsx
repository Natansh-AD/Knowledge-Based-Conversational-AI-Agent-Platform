import React, { useState, useEffect } from "react";
import { useAuth } from "../services/auth/useAuth";
import TagSelector from "./TagSelector"; // your reusable component

const CreateAgentModal = ({ isOpen, onClose, onAgentCreated }) => {
  const { getDocs, createAgent, getTags, createTag } = useAuth(); // include tags functions

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [documentId, setDocumentId] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Tags
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch documents when modal opens or search/page changes
  useEffect(() => {
    if (isOpen) fetchDocuments();
  }, [isOpen, page, search]);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const filters = {
        status: "ready",
        ...(search ? { search } : {}),
      };

      const data = await getDocs(filters, page, 10); // page_size=10
      setDocuments(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!documentId) {
      setError("Please select a document.");
      return;
    }

    try {
      const payload = {
        name,
        description,
        system_prompt: systemPrompt,
        document: documentId,
        tags: selectedTags.map((t) => t.id), // send only IDs
      };

      const data = await createAgent(payload);
      onAgentCreated(data); // refresh agents table
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setSystemPrompt("");
    setDocumentId(null);
    setSearch("");
    setPage(1);
    setError(null);
    setSelectedTags([]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button
          className="modal-close-btn"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          &times;
        </button>

        <h2 className="modal-title">Create New Agent</h2>

        {error && (
          <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            placeholder="System Prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            required
          />

          {/* Tag Selector */}
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            getTags={getTags}       // fetch existing tags
            createTag={createTag}   // create new tags dynamically
          />

          {/* Document selection */}
          <div>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ padding: "10px", marginBottom: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
            />

            {loadingDocs ? (
              <p>Loading documents...</p>
            ) : (
              <select
                value={documentId || ""}
                onChange={(e) => setDocumentId(e.target.value)}
                required
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", width: "100%", marginBottom: "10px" }}
              >
                <option value="">-- Select a Document --</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            )}

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Create Agent
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;