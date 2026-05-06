import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileService } from "../services/FileService";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [storageInfo, setStorageInfo] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const loadQuota = async () => {
    try {
      const quota = await fileService.getQuota();
      const storageData = {
        used: quota.usedBytes,
        available: quota.availableBytes,
        percentage: typeof quota.usagePercentage === "number" ? quota.usagePercentage * 100 : 0,
        fileCount: quota.fileCount,
      };
      setStorageInfo(storageData);
      localStorage.setItem("storage_info", JSON.stringify(storageData));
      console.log("[UploadPage] Quota loaded:", storageData);
    } catch (error) {
      console.error("[UploadPage] Error loading quota:", error);
    }
  };

  useEffect(() => {
    console.log("[UploadPage] Mounted");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuota();
  }, []);

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const openFolderBrowser = () => {
    folderInputRef.current?.click();
  };

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
    addFilesToQueue(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFilesToQueue(files);
    e.target.value = "";
  };

  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files);
    addFilesToQueue(files);
    e.target.value = "";
  };

  const handleTestUpload = () => {
    // Create mock files for demo
    const mockFiles = [
      new File(["Test content 1"], "test1.txt", { type: "text/plain" }),
      new File(["Test content 2"], "test2.txt", { type: "text/plain" }),
      new File(["Test content 3"], "test3.jpg", { type: "image/jpeg" }),
    ];
    addFilesToQueue(mockFiles);
  };

  const addFilesToQueue = (files) => {
    console.log("[UploadPage] addFilesToQueue called with", files.length, "files");
    if (!files || files.length === 0) {
      console.warn("[UploadPage] No files provided");
      return;
    }

    const newFiles = files.map(file => {
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      console.log(`[UploadPage] Adding file: ${file.name} (${sizeInMB} MB, ${file.type})`);
      return {
        id: `${Date.now()}_${Math.random()}`,
        file: file,
        name: file.name,
        size: sizeInMB,
        type: file.type,
        status: "pending",
      };
    });
    
    setUploadQueue(prev => {
      const updated = [...prev, ...newFiles];
      console.log("[UploadPage] Queue updated, total files:", updated.length);
      return updated;
    });
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    const pendingFiles = uploadQueue.filter(f => f.status === "pending");
    
    if (uploadQueue.length === 0) {
      setError("No files in queue");
      return;
    }

    if (pendingFiles.length === 0) {
      setError("No pending files to upload");
      return;
    }

    console.log("[UploadPage] Starting upload, pending files:", pendingFiles.length);
    setUploading(true);
    setError(null);
    setSuccess(null);

    let successCount = 0;

    for (const fileItem of pendingFiles) {
      try {
        console.log(`[UploadPage] Uploading file: ${fileItem.name}`);
        setUploadProgress(prev => ({ ...prev, [fileItem.id]: 25 }));

        const response = await fileService.uploadFile(fileItem.file);
        console.log(`[UploadPage] Upload response:`, response);

        // Save storage info from response
        if (response && response.newUsedStorage !== undefined) {
          const storageData = {
            used: response.newUsedStorage,
            available: response.availableStorage,
            percentage: response.usagePercentage,
          };
          setStorageInfo(storageData);
          localStorage.setItem("storage_info", JSON.stringify(storageData));
          console.log("[UploadPage] Storage updated:", storageData);
        }

        setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }));
        setUploadQueue(prev =>
          prev.map(f =>
            f.id === fileItem.id ? { ...f, status: "completed" } : f
          )
        );
        successCount++;
        console.log(`[UploadPage] File uploaded successfully: ${fileItem.name}`);
      } catch (err) {
        console.error(`[UploadPage] Upload error for ${fileItem.name}:`, err);
        setError(err.message || `Failed to upload ${fileItem.name}`);
        setUploadQueue(prev =>
          prev.map(f =>
            f.id === fileItem.id ? { ...f, status: "error" } : f
          )
        );
      }
    }

    console.log(`[UploadPage] Upload complete. Success: ${successCount}/${pendingFiles.length}`);
    setUploading(false);

    if (successCount > 0) {
      setSuccess(`Successfully uploaded ${successCount} file(s)`);
      if (successCount === pendingFiles.length) {
        setTimeout(() => navigate("/"), 1500);
      }
    }
  };

  const handleRemove = (id) => {
    setUploadQueue(prev => prev.filter(f => f.id !== id));
  };

  const completedCount = uploadQueue.filter(f => f.status === "completed").length;
  const allCompleted = uploadQueue.length > 0 && uploadQueue.every(f => f.status === "completed");

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
            cursor: "pointer",
            pointerEvents: uploading ? "none" : "auto",
            opacity: uploading ? 0.6 : 1,
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📤</div>
          <h3 style={{ fontSize: "18px", marginBottom: "8px", color: "#f8fafc" }}>
            Drag and drop files here
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "16px" }}>or</p>
          
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              className="upload-btn"
              onClick={openFileBrowser}
              disabled={uploading}
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
              disabled={uploading}
            />

            <button
              type="button"
              className="upload-btn"
              onClick={openFolderBrowser}
              disabled={uploading}
            >
              Select Folder
            </button>
            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory=""
              directory=""
              onChange={handleFolderSelect}
              style={{ display: "none" }}
              disabled={uploading}
            />

            <button
              type="button"
              className="upload-btn"
              onClick={handleTestUpload}
              style={{ background: "#10b981" }}
              disabled={uploading}
            >
              Test Upload (Demo)
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: "14px 16px",
            borderRadius: "14px",
            background: "rgba(248, 113, 113, 0.16)",
            border: "1px solid rgba(248, 113, 113, 0.28)",
            color: "#fee2e2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                background: "rgba(248, 113, 113, 0.2)",
                border: "1px solid rgba(248, 113, 113, 0.4)",
                color: "#fecaca",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div style={{
            padding: "14px 16px",
            borderRadius: "14px",
            background: "rgba(16, 185, 129, 0.16)",
            border: "1px solid rgba(16, 185, 129, 0.28)",
            color: "#d1fae5",
          }}>
            ✓ {success}
          </div>
        )}

        {/* Storage Info */}
        {storageInfo && (
          <div style={{
            padding: "16px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "#d1fae5",
          }}>
            <p style={{ marginBottom: "8px", fontSize: "14px" }}>
              📊 Storage: {(storageInfo.used / 1024 / 1024).toFixed(2)} MB / {(storageInfo.available / 1024 / 1024).toFixed(2)} MB ({storageInfo.fileCount} files)
            </p>
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              height: "8px",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "8px",
            }}>
              <div style={{
                width: `${storageInfo.percentage || 0}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981, #34d399)",
              }}></div>
            </div>
            <p style={{ fontSize: "12px" }}>
              {(storageInfo.percentage || 0).toFixed(1)}% used
            </p>
          </div>
        )}

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>
                Files ({completedCount}/{uploadQueue.length})
              </h3>
              {!uploading && uploadQueue.some(f => f.status === "pending" || f.status === "error") && (
                <button className="upload-btn" onClick={handleUpload}>
                  Start Upload
                </button>
              )}
              {allCompleted && (
                <button className="upload-btn" onClick={() => navigate("/")} style={{ background: "#10b981" }}>
                  ✓ Done - View Files
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {uploadQueue.map(fileItem => (
                <div key={fileItem.id} style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#f8fafc", marginBottom: "4px", wordBreak: "break-all" }}>
                      {fileItem.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {fileItem.size} MB
                      {fileItem.status === "completed" && " ✓"}
                      {fileItem.status === "error" && " ✗"}
                    </p>
                  </div>

                  <div style={{ width: "200px", textAlign: "right" }}>
                    <div style={{ 
                      background: "rgba(255, 255, 255, 0.05)", 
                      height: "6px", 
                      borderRadius: "3px", 
                      overflow: "hidden",
                      marginBottom: "4px"
                    }}>
                      <div style={{ 
                        width: `${uploadProgress[fileItem.id] || 0}%`,
                        height: "100%",
                        background: fileItem.status === "error" 
                          ? "#ef4444" 
                          : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        transition: "width 0.3s ease"
                      }}></div>
                    </div>
                    <p style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {uploadProgress[fileItem.id] || 0}%
                    </p>
                  </div>

                  {(fileItem.status === "pending" || fileItem.status === "error") && (
                    <button
                      onClick={() => handleRemove(fileItem.id)}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#cbd5e1",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadQueue.length === 0 && !error && (
          <div className="empty-state">
            <div className="icon">📁</div>
            <h3>No files selected</h3>
            <p>Drag files here or click Browse to select files to upload</p>
          </div>
        )}
      </div>
    </div>
  );
}

