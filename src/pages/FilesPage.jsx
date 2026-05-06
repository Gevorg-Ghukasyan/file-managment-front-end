import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileService } from "../services/FileService";
import FileGrid from "../components/FileGrid";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
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

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fileService.deleteFile(id);
        await loadFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        setError(error.message || "Failed to delete file");
      }
    }
  };

  const handleDownload = async (file) => {
    try {
      await fileService.downloadFile(file.id, file.fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError(error.message || "Failed to download file");
    }
  };

  const handleUpload = () => {
    navigate("/upload");
  };

  return (
    <div>
      <div className="toolbar">
        <h2>My Drive</h2>
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
      ) : (
        <FileGrid files={files} onDelete={handleDelete} onDownload={handleDownload} />
      )}
    </div>
  );
}
