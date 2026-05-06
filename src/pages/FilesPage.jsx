import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileService } from "../services/FileService";
import FileGrid from "../components/FileGrid";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[FilesPage] Loading files...");
      const data = await fileService.getFiles();
      console.log("[FilesPage] Files loaded:", data);
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[FilesPage] Error loading files:", err);
      setError(err.message || "Failed to load files");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const resolveFileId = (file) =>
    file?.id || file?.fileId || file?.fileGuid || file?.Id || file?.ID || file?.fileID || file?.file_id || file?.id;

  const resolveFileName = (file) =>
    file?.fileName || file?.name || file?.path || file?.title || "download";

  const handleDelete = async (file) => {
    const fileId = resolveFileId(file);
    console.log("[FilesPage] delete file", file, fileId);
    if (!fileId) {
      setError("Unable to delete file: missing file identifier.");
      return;
    }

    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fileService.deleteFile(fileId);
        await loadFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        setError(error.message || "Failed to delete file");
      }
    }
  };

  const handleDownload = async (file) => {
    const fileId = resolveFileId(file);
    const fileName = resolveFileName(file);
    console.log("[FilesPage] download file", file, fileId, fileName);
    if (!fileId) {
      setError("Unable to download file: missing file identifier.");
      return;
    }

    try {
      await fileService.downloadFile(fileId, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError(error.message || "Failed to download file");
    }
  };

  const handleUpload = () => {
    navigate("/upload");
  };

  const filteredFiles = files.filter((file) => {
    const name = resolveFileName(file).toLowerCase();
    return name.includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div>
      <div className="toolbar">
        <div style={{ display: "flex", flex: 1, gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <h2 style={{ margin: 0, whiteSpace: "nowrap" }}>My Drive</h2>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              className="search"
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
        <button className="upload-btn" onClick={handleUpload}>
          ⬆️ Upload Files
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="icon">⏳</div>
          <h3>Loading files...</h3>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <h3>Error loading files</h3>
          <p>{error}</p>
          <button className="upload-btn" onClick={loadFiles} style={{ marginTop: "16px" }}>
            Retry
          </button>
        </div>
      ) : files.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📁</div>
          <h3>Your drive is empty</h3>
          <p>Upload files to get started</p>
        </div>
      ) : (
        <>
          {filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔎</div>
              <h3>No files found</h3>
              <p>Try a different search term.</p>
            </div>
          ) : (
            <FileGrid files={filteredFiles} onDelete={handleDelete} onDownload={handleDownload} />
          )}
        </>
      )}
    </div>
  );
}
