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
    )
      return "📄";
    if (contentType.includes("sheet") || contentType.includes("excel"))
      return "📊";
    return "📄";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid">
      {files.map((file) => (
        <div className="card" key={file.id}>
          <div className="file-icon">
            {getFileIcon(file.contentType)}
          </div>

          <div className="file-name" title={file.fileName}>
            {file.fileName}
          </div>

          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "auto" }}>
            <p style={{ margin: "2px 0" }}>{file.formattedSize}</p>
            <p style={{ margin: "2px 0" }}>{formatDate(file.createdAt)}</p>
          </div>

          <div className="file-actions">
            <button title="Download" onClick={() => onDownload && onDownload(file)}>
              ⬇️
            </button>
            <button title="Delete" onClick={() => onDelete(file.id)}>
              ❌
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
