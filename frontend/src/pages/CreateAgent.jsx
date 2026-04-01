import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../services/auth/useAuth";
import TagSelector from "../components/TagSelector";
import MultiSelectDropdown from "../components/MultiSelectDropdown";

const CreateEditAgentPage = () => {
  const { getDocs, createAgent, getAgentById, updateAgent, getTags, createTag } = useAuth();
  const navigate = useNavigate();
  const { org, agentId } = useParams(); // agentId exists only for edit

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [creatingOrUpdating, setCreatingOrUpdating] = useState(false);

  const isEditMode = Boolean(agentId);

  // Warn before leaving unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (name || systemPrompt || selectedDocuments.length || selectedTags.length) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [name, systemPrompt, selectedDocuments, selectedTags]);

  // Fetch all documents
  useEffect(() => {
    const fetchAllDocs = async () => {
      setLoadingDocs(true);
      try {
        let allDocs = [];
        let page = 1;
        let totalPages = 1;

        do {
          const data = await getDocs({ status: "ready" }, page, 50);
          allDocs = [...allDocs, ...data.results.filter(doc => doc.status === "ready")];
          totalPages = Math.ceil(data.count / 50);
          page++;
        } while (page <= totalPages);

        setDocuments(allDocs);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching documents");
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchAllDocs();
  }, [getDocs]);

  // Fetch agent details if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchAgent = async () => {
      setLoadingAgent(true);
      try {
        const agent = await getAgentById(agentId);
        setName(agent.name);
        setDescription(agent.description || "");
        setSystemPrompt(agent.system_prompt || "");
        // ✅ store full objects for selectedDocuments
        setSelectedDocuments(agent.documents_detail || []);
        setSelectedTags(agent.tags_detail || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load agent details");
      } finally {
        setLoadingAgent(false);
      }
    };

    fetchAgent();
  }, [agentId, getAgentById, isEditMode]);

  const handleSubmit = async () => {
    if (!name || !systemPrompt || selectedDocuments.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setCreatingOrUpdating(true);

      const payload = {
        name,
        description,
        system_prompt: systemPrompt,
        documents: selectedDocuments.map(d => d.id), // send IDs to backend
        tags: selectedTags.map(t => t.id),
      };

      if (isEditMode) {
        await updateAgent(agentId, payload);
        toast.success("Agent updated successfully");
      } else {
        await createAgent(payload);
        toast.success("Agent created successfully");
      }

      navigate(`/${org}/agents`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || err.message || "Error saving agent");
    } finally {
      setCreatingOrUpdating(false);
    }
  };

  if (isEditMode && loadingAgent) {
    return <p className="p-6">Loading agent...</p>;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Form */}
          <div className="lg:col-span-2 space-y-6">
            <button
              onClick={() => navigate(`/${org}/agents`)}
              className="text-sm text-gray-500 hover:text-gray-800 mb-2"
            >
              ← Back to Agents
            </button>

            <h1 className="text-3xl font-semibold text-gray-900 mb-1">
              {isEditMode ? "Edit Agent" : "Create New Agent"}
            </h1>
            <p className="text-gray-500 text-sm mb-4">
              Fill out all fields to define your agent’s behavior and knowledge sources.
            </p>

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <h2 className="text-lg font-medium">Basic Info</h2>
              <input
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-300"
                placeholder="Agent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-gray-300"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* System Prompt */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-2">
              <h2 className="text-lg font-medium">🧠 System Prompt</h2>
              <textarea
                className="w-full border rounded-md px-3 py-3 font-mono text-sm focus:ring-2 focus:ring-gray-300"
                style={{ minHeight: "200px" }}
                placeholder="Define how the agent should behave..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>

            {/* Documents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3">
              <h2 className="text-lg font-medium">📄 Documents</h2>
              {loadingDocs ? (
                <p className="text-sm text-gray-500">Loading documents...</p>
              ) : (
                <MultiSelectDropdown
                  options={documents}                     // all docs
                  selectedValues={selectedDocuments.map(d => d.id)}  // only IDs
                  onChange={(ids) => {
                    const selectedDocs = documents.filter(doc => ids.includes(doc.id));
                    setSelectedDocuments(selectedDocs);
                  }}
                  labelKey="name"
                  valueKey="id"
                  placeholder="Select documents"
                />
              )}
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-medium mb-2">🏷️ Tags</h2>
              <TagSelector
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                getTags={getTags}
                createTag={createTag}
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={creatingOrUpdating}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {creatingOrUpdating ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Agent" : "Create Agent")}
              </button>
            </div>
          </div>

          {/* Sidebar Tips */}
          <div className="hidden lg:flex flex-col gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-2">
              <h3 className="font-semibold text-gray-900">💡 Tips</h3>
              <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>System Prompt defines the agent’s behavior and tone.</li>
                <li>Select relevant documents for better knowledge retrieval.</li>
                <li>Use tags to categorize agents for easier search.</li>
                <li>All fields except description are mandatory.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateEditAgentPage;