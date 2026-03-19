import React, { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import CreateAgentModal from "../components/CreateAgentModal";
import EditAgentModal from "../components/EditAgentModal";
import "../styles/DocumentsPage.css";
import { useNavigate, useParams } from "react-router-dom";

const AgentsPage = () => {
  const { getAgents, getTags, updateAgentStatus, deleteAgent } = useAuth();
  const navigate = useNavigate();
  const {org} = useParams();
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    tag: "",
    status: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    num_pages: 1,
    current_page: 1,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch agents
  const fetchAgents = async () => {
    const data = await getAgents(filters, pagination.page, pagination.page_size);

    setAgents(data.results);

    setPagination((prev) => ({
      ...prev,
      num_pages: data.num_pages,
      current_page: data.current_page,
    }));
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartChat = async (agentId) => {
    if (!org || !agentId) return;

    try {
      navigate(`/${org}/agents/${agentId}`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchTags();
  }, []);

  // Filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });

    setPagination({
      ...pagination,
      page: 1,
    });
  };

  // Click tag to filter
  const handleTagClick = (tagName) => {
    setFilters({
      ...filters,
      tag: tagName,
    });
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  // Toggle active status
  const handleStatusToggle = async (agent) => {
    await updateAgentStatus(agent.id, !agent.is_active);
    fetchAgents();
  };

  // Edit agent
  const openEditModal = (agent) => {
    setSelectedAgent(agent);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAgent(null);
  };

  // Delete agent
  const handleDelete = async (agentId) => {
    if (!window.confirm("Delete this agent?")) return;

    await deleteAgent(agentId);
    fetchAgents();
  };

  return (
    <div className="docs-container">
      {/* Header */}
      <div className="header-row">
        <h2>Agents</h2>

        {/* Button */}
        <button
          type="button"  // ✅ important, prevents accidental form submission
          className="upload-button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add New
        </button>
      </div>

      {/* Filters */}
      <div className="filters">

        <div className="filter-item">
          <label>Search</label>
          <input
            name="search"
            value={filters.search}
            placeholder="Agent name"
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item">
          <label>Tag</label>
          <select
            name="tag"
            value={filters.tag}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* Agents Table */}
      <table className="docs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Document</th>
            <th>Tags</th>
            <th>Status</th>
            <th style={{ width: "80px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {agents.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No agents found
              </td>
            </tr>
          ) : (
            agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.name}</td>

                <td>{agent.description}</td>

                <td>{agent.document_name}</td>

                <td>
                  {agent.tags_detail?.map((tag) => (
                    <span
                      key={tag.id}
                      className="tag clickable"
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                    </span>
                  ))}
                </td>

                {/* Toggle */}
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={agent.is_active}
                      onChange={() => handleStatusToggle(agent)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>

                {/* Actions */}
                <td>
                  <button
                    className="action-btn"
                    onClick={() => openEditModal(agent)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(agent.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => handleStartChat(agent.id)}
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: pagination.num_pages }, (_, i) => (
          <button
            key={i + 1}
            className={pagination.current_page === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateAgentModal
          isOpen={isCreateModalOpen}          // ✅ pass isOpen prop
          onClose={() => setIsCreateModalOpen(false)}
          onAgentCreated={fetchAgents}        // ✅ callback after creation
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditAgentModal
          agent={selectedAgent}
          onClose={closeEditModal}
          onAgentUpdated={fetchAgents}
        />
      )}
    </div>
  );
};

export default AgentsPage;