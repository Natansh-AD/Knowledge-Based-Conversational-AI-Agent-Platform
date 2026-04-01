import React, { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import CreateAgentModal from "../components/CreateAgentModal";
import EditAgentModal from "../components/EditAgentModal";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTitle } from "../components/layout/TitleContext";
import usePageTitle from "../components/layout/usePageTitle";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import toast from "react-hot-toast";

const AgentsPage = () => {
  usePageTitle("Agents");

  const { getAgents, getTags, updateAgentStatus, deleteAgent } = useAuth();
  const navigate = useNavigate();
  const { org } = useParams();
  const { setTitle } = useTitle();
  const { setTopBarActions } = useOutletContext() || {};

  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    tag: [],
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

  // Page Title
  useEffect(() => {
    setTitle("Agents");
  }, []);

  // Top bar button
  useEffect(() => {
    if (setTopBarActions) {
      setTopBarActions(
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-8 px-3 text-sm font-medium flex items-center justify-center bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Add New
        </button>
      );
    }

    return () => setTopBarActions?.(null);
  }, [setTopBarActions]);

  const fetchAgents = async () => {
    const data = await getAgents(
      {
        ...filters,
        tag: filters.tag.join(","),
      },
      pagination.page,
      pagination.page_size
    );

    setAgents(data.results);
    setPagination((prev) => ({
      ...prev,
      num_pages: data.num_pages,
      current_page: data.current_page,
    }));
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // FIX 3: toggle tag (multi-select)
  const handleTagClick = (tagId) => {
    const exists = filters.tag.includes(tagId);

    const updated = exists
      ? filters.tag.filter((t) => t !== tagId)
      : [...filters.tag, tagId];

    setFilters({ ...filters, tag: updated });
  };

  const handlePageChange = (page) =>
    setPagination({ ...pagination, page });

  const handleStatusToggle = async (agent) => {
    await updateAgentStatus(agent.id, !agent.is_active);
    fetchAgents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this agent?")) return;
    await deleteAgent(id);
    toast.success("Agent deleted successfully")
    fetchAgents();
  };

  const handleStartChat = (agentId) =>
    navigate(`/${org}/agents/${agentId}`);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Agent name"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tag</label>
          <MultiSelectDropdown
            options={tags}
            labelKey="name"
            valueKey="id"
            selectedValues={filters.tag}
            onChange={(values) => {
              setFilters({ ...filters, tag: values });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Select tags"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {["Name","Description","Document","Tags","Status","Actions"].map((col) => (
                <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {agents.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No agents found
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id}>
                  <td className="px-4 py-2">{agent.name}</td>
                  <td className="px-4 py-2">{agent.description}</td>
                  <td className="px-4 py-2">
                    {agent.document_names?.join(", ")}
                  </td>

                  <td className="px-4 py-2 flex flex-wrap gap-1">
                    {agent.tags_detail?.map((tag) => (
                      <span
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        className={`px-2 py-1 text-xs rounded cursor-pointer
                          ${filters.tag.includes(tag.id)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                          }`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </td>

                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={agent.is_active}
                      onChange={() => handleStatusToggle(agent)}
                    />
                  </td>

                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAgent(agent);
                        setIsEditModalOpen(true);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleStartChat(agent.id)}
                      className="text-sm text-gray-800 hover:underline"
                    >
                      Chat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {Array.from({ length: pagination.num_pages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md border ${
              pagination.current_page === i + 1
                ? "bg-gray-900 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateAgentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onAgentCreated={fetchAgents}
        />
      )}

      {isEditModalOpen && (
        <EditAgentModal
          agent={selectedAgent}
          onClose={() => setIsEditModalOpen(false)}
          onAgentUpdated={fetchAgents}
        />
      )}
    </div>
  );
};

export default AgentsPage;