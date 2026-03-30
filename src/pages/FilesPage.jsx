import { useEffect, useState } from "react";
import { fileService } from "../services/FileService";
import FileGrid from "../components/FileGrid";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fileService.getFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fileService.deleteFile(id);
        loadFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const handleUpload = () => {
    // Trigger file upload dialog
    alert("Upload feature coming soon!");
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
      ) : (
        <FileGrid files={files} onDelete={handleDelete} />
      )}
    </div>
  );
}