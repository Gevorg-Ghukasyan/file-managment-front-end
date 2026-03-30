import { useState } from "react";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      progress: 0
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      progress: 0
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  return (
    <div>
      <div className="toolbar">
        <h2>⬆️ Upload Files</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: "2px dashed " + (isDragging ? "#3b82f6" : "rgba(255, 255, 255, 0.2)"),
            borderRadius: "12px",
            padding: "48px 24px",
            textAlign: "center",
            background: isDragging ? "rgba(59, 130, 246, 0.1)" : "rgba(15, 23, 42, 0.4)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📤</div>
          <h3 style={{ fontSize: "18px", marginBottom: "8px", color: "#f8fafc" }}>
            Drag and drop files here
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "16px" }}>or</p>
          
          <label style={{ cursor: "pointer" }}>
            <button className="upload-btn" component="span">
              Browse Files
            </button>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#f8fafc" }}>
              Uploading ({uploadedFiles.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {uploadedFiles.map(file => (
                <div key={file.id} style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ color: "#f8fafc", marginBottom: "4px" }}>{file.name}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8" }}>{file.size} MB</p>
                  </div>
                  <div style={{ width: "200px", background: "rgba(255, 255, 255, 0.05)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ 
                      width: `${Math.random() * 100}%`, 
                      height: "100%", 
                      background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                      transition: "width 0.3s ease"
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}