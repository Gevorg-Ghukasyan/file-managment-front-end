export default function FileGrid({ files, onDelete, onDownload }) {
  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📁</div>
        <h3>Your drive is empty</h3>
        <p>Upload files to get started</p>
      </div>
    );
  }

  const getFileIcon = (contentType) => {
    if (!contentType) return "📄";
    if (contentType.includes("image")) return "🖼️";
    if (contentType.includes("video")) return "🎥";
    if (contentType.includes("audio")) return "🎵";
    if (contentType.includes("pdf")) return "📕";
    if (contentType.includes("text") || contentType.includes("plain")) return "📝";
    if (
      contentType.includes("word") ||
      contentType.includes("document") ||
      contentType.includes("msword")
    ) {
      return "📄";
    }
    if (contentType.includes("sheet") || contentType.includes("excel")) return "📊";
    return "📄";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBytes = (bytes) => {
    if (bytes == null || Number.isNaN(Number(bytes))) return "";
    const value = Number(bytes);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    if (value < 1024 * 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
    return `${(value / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  const resolveFileId = (file) =>
    file?.id || file?.fileId || file?.fileGuid || file?.Id || file?.ID || file?.fileID || file?.file_id;

  const resolveFileName = (file) =>
    file?.fileName || file?.name || file?.path || file?.title || "Untitled";

  return (
    <div className="grid">
      {files.map((file) => {
        const fileId = resolveFileId(file);
        const fileName = resolveFileName(file);
        const createdAt = file.createdAt || file.uploadedAt || file.createdOn;
        const sizeText = file.formattedSize || formatBytes(file.size || file.length || file.bytes);

        return (
          <div key={fileId || fileName} className="file-card">
            <div className="file-info">
              <div className="file-icon">{getFileIcon(file.contentType)}</div>
              <div className="file-name" title={fileName}>{fileName}</div>
              <div className="file-details">
                <p>{sizeText}</p>
                <p>{createdAt ? formatDate(createdAt) : ""}</p>
              </div>
            </div>
            <div className="file-buttons">
              <button
                title="Download"
                type="button"
                onClick={() => onDownload && onDownload(file)}
                className="file-btn download-btn"
              >
                ⬇️ Download
              </button>
              <button
                title="Delete"
                type="button"
                onClick={() => onDelete && onDelete(file)}
                className="file-btn delete-btn"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
