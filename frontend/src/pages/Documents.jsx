import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../services/auth/useAuth";
import DocumentUploadModal from "../components/DocumentUploadModal";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import { useTitle } from "../components/layout/TitleContext";
import { useOutletContext } from "react-router-dom";

// Simple debounce helper
const debounce = (func, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function DocumentsPage() {
  const { getDocs, fetchUsers } = useAuth();
  const { setTitle } = useTitle();
  const { setTopBarActions } = useOutletContext() || {};

  const todayDateStr = new Date().toISOString().split("T")[0];

  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    uploaded_by: [],
    file_type: [],
    status: "",
    start_date: todayDateStr,
    end_date: todayDateStr,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    num_pages: 1,
    current_page: 1,
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fileTypeOptions = [
    { id: "application/pdf", name: "PDF" },
    { id: "docx", name: "DOCX" },
    { id: "txt", name: "TXT" },
    { id: "text/csv", name: "CSV" },
  ];

  // -----------------------------
  // Set page title
  // -----------------------------
  useEffect(() => setTitle("Documents"), [setTitle]);

  // Top bar "Add New"
  useEffect(() => {
    if (setTopBarActions) {
      setTopBarActions(
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="h-8 px-3 text-sm font-medium flex items-center justify-center bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Add New
        </button>
      );
    }
    return () => setTopBarActions?.(null);
  }, [setTopBarActions]);

  // -----------------------------
  // Fetch users ONCE
  // -----------------------------
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers();
        setUsers(res || []);
      } catch (err) {
        toast.err("Failed to fetch users", err);
      }
    };
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // -----------------------------
  // Fetch documents
  // -----------------------------
  const fetchDocuments = useCallback(async () => {
    try {
      const data = await getDocs(
        {
          ...filters,
          uploaded_by: filters.uploaded_by.join(","), // CSV string for stable dep
          file_type: filters.file_type.join(","),
        },
        pagination.page,
        pagination.page_size
      );

      setDocuments(data.results || []);
      setPagination(prev => ({
        ...prev,
        num_pages: data.num_pages || prev.num_pages,
        current_page: data.current_page || prev.current_page,
      }));
    } catch (err) {
      toast.err("Failed to fetch documents", err);
    }
  }, [
    getDocs,
    filters.search,
    filters.status,
    filters.start_date,
    filters.end_date,
    filters.uploaded_by.join(","),
    filters.file_type.join(","),
    pagination.page,
    pagination.page_size,
  ]);

  // Run fetchDocuments when relevant primitive values change
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const debouncedSearchChange = debounce(value => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, 300);

  const handlePageChange = newPage =>
    setPagination(prev => ({ ...prev, page: newPage }));

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            name="search"
            defaultValue={filters.search}
            onChange={e => debouncedSearchChange(e.target.value)}
            placeholder="Enter document name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          />
        </div>

        {/* Date range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created Date Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              max={filters.end_date}
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              min={filters.start_date}
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Uploaded By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uploaded By
          </label>
          <MultiSelectDropdown
            options={users}
            labelKey="username"
            valueKey="id"
            selectedValues={filters.uploaded_by}
            onChange={values => {
              setFilters(prev => ({ ...prev, uploaded_by: values }));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            placeholder="Select users"
          />
        </div>

        {/* File type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Type
          </label>
          <MultiSelectDropdown
            options={fileTypeOptions}
            labelKey="name"
            valueKey="id"
            selectedValues={filters.file_type}
            onChange={values => {
              setFilters(prev => ({ ...prev, file_type: values }));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            placeholder="Select file types"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          >
            <option value="">All</option>
            <option value="uploaded">Uploaded</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md max-h-[600px] relative">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "Name",
                "File Type",
                "Status",
                "Version",
                "Created At",
                "Uploaded By",
                "Last Modified",
              ].map(col => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{doc.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {fileTypeOptions.find(f => f.id === doc.file_type)?.name ||
                      doc.file_type}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">
                    {doc.status}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{doc.version}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(doc.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {users.find(u => u.id === doc.uploaded_by)?.username ||
                      "Unknown"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(doc.last_modified_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 flex-wrap gap-2">
        {Array.from({ length: pagination.num_pages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md border ${
              pagination.current_page === i + 1
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && <DocumentUploadModal onClose={closeUploadModal} />}
    </div>
  );
}