import React, { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import DocumentUploadModal from "../components/DocumentUploadModal"; 
import "../styles/DocumentsPage.css";

const DocumentsPage = () => {
  const { getDocs } = useAuth();

  // Today's date string for default range
  const todayDateStr = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

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

  // Fetch documents
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

  // Filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Upload modal
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <div className="docs-container">
      {/* Header with title + upload button */}
      <div className="header-row">
        <h2>Documents</h2>
        <button className="upload-button" onClick={openUploadModal}>
          Add New
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="search">Search by Name</label>
          <input
            id="search"
            type="text"
            name="search"
            placeholder="Enter document name"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item date-range-filter">
          <label>Created Date Range</label>
          <div className="date-range-inputs">
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              max={filters.end_date}
            />
            <span className="date-range-separator">to</span>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              min={filters.start_date}
            />
          </div>
        </div>

        <div className="filter-item">
          <label htmlFor="uploaded_by">Uploaded By (User ID)</label>
          <input
            id="uploaded_by"
            type="text"
            name="uploaded_by"
            placeholder="Uploader ID"
            value={filters.uploaded_by}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="file_type">File Type</label>
          <input
            id="file_type"
            type="text"
            name="file_type"
            placeholder="pdf, docx, png..."
            value={filters.file_type}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="uploaded">Uploaded</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Documents table */}
      <table className="docs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>File Type</th>
            <th>Status</th>
            <th>Version</th>
            <th>Created At</th>
            <th>Uploaded By</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No documents found.
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.file_type}</td>
                <td>{doc.status}</td>
                <td>{doc.version}</td>
                <td>{new Date(doc.created_at).toLocaleString()}</td>
                <td>{doc.uploaded_by}</td>
                <td>{new Date(doc.last_modified_at).toLocaleString()}</td>
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

      {/* Upload modal */}
      {isUploadModalOpen && <DocumentUploadModal onClose={closeUploadModal} />}
    </div>
  );
};

export default DocumentsPage;