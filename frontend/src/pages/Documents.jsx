import React, { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { useTitle } from "../components/layout/TitleContext";

export default function DocumentsPage() {
  const { getDocs } = useAuth();
  const { setTitle } = useTitle();

  const todayDateStr = new Date().toISOString().split("T")[0];

  const [documents, setDocuments] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    uploaded_by: "",
    file_type: "",
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

  // ✅ SET TITLE
  useEffect(() => {
    setTitle("Documents");
  }, []);

  const fetchDocuments = async () => {
    const data = await getDocs(filters, pagination.page, pagination.page_size);
    setDocuments(data.results);
    setPagination({
      ...pagination,
      num_pages: data.num_pages,
      current_page: data.current_page,
    });
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters, pagination.page, pagination.page_size]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* ❌ REMOVED TITLE */}

      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openUploadModal}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Add New
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Enter document name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uploaded By (User ID)
          </label>
          <input
            type="text"
            name="uploaded_by"
            value={filters.uploaded_by}
            onChange={handleFilterChange}
            placeholder="Uploader ID"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Type
          </label>
          <select
            name="file_type"
            value={filters.file_type}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          >
            <option value="">All</option>
            <option value="application/pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="text/csv">CSV</option>
          </select>
        </div>

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
      <div className="overflow-x-auto bg-white rounded-lg shadow-md max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Name", "File Type", "Status", "Version", "Created At", "Uploaded By", "Last Modified"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                )
              )}
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
              documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{doc.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{doc.file_type}</td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">{doc.status}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{doc.version}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(doc.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{doc.uploaded_by}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(doc.last_modified_at).toLocaleString()}</td>
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

      {/* Modal */}
      {isUploadModalOpen && <DocumentUploadModal onClose={closeUploadModal} />}
    </div>
  );
}