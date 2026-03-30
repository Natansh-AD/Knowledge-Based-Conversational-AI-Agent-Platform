import React, { useState, useEffect } from "react";
import { useAuth } from "../services/auth/useAuth";
import TagSelector from "./TagSelector";
import { toast } from "react-hot-toast";
import MultiSelectDropdown from "./MultiSelectDropdown";

const CreateAgentModal = ({ isOpen, onClose, onAgentCreated }) => {
  const { getDocs, createAgent, getTags, createTag } = useAuth(); // include tags functions

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Tags
  const [selectedTags, setSelectedTags] = useState([]);

  const [creating, setCreating] = useState(false);

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

  const mergedOptions = React.useMemo(() => {
    const merged = [...documents];

    selectedDocuments.forEach((id) => {
      if (!merged.find((d) => d.id === id)) {
        merged.push({ id, name: `Document ${id}` });
      }
    });

    return merged;
  }, [documents, selectedDocuments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedDocuments.length === 0) {
      setError("Please select at least one document.");
      return;
    }

    try {
      const payload = {
        name,
        description,
        system_prompt: systemPrompt,
        documents: selectedDocuments,
        tags: selectedTags.map((t) => t.id),
      };
      setCreating(true);
      const data = await createAgent(payload);
      onAgentCreated(data); // refresh agents table
      toast.success(`Agent ${payload.name} Created`)
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      toast.err(err.response?.data?.detail || err.message);
    }
    finally{
      setCreating(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setSystemPrompt("");
    setSelectedDocuments([]);
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
              <MultiSelectDropdown
                options={mergedOptions}
                selectedValues={selectedDocuments}
                onChange={setSelectedDocuments}
                placeholder="Select documents..."
                labelKey="name"
                valueKey="id"
              />
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

          <button type="submit" className="submit-button" disabled={creating}>
            {creating ? "Creating..." : "Create Agent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;