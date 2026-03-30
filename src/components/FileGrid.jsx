export default function FileGrid({ files, onDelete }) {
  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📁</div>
        <h3>Your drive is empty</h3>
        <p>Upload files to get started</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {files.map((file) => (
        <div className="card" key={file.id}>
          <div className="file-icon">
            {file.type === "folder" ? "📁" : "📄"}
          </div>

          <div className="file-name">{file.name}</div>

          <div className="file-actions">
            <button title="Download">⬇️</button>
            <button title="Delete" onClick={() => onDelete(file.id)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );
}