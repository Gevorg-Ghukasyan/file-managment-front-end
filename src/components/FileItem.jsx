export default function FileItem({ file, onDelete, onDownload }) {
  return (
    <div className="file-item">
      <div>
        <strong>{file.name}</strong>
        <p>{file.size} KB</p>
      </div>

      <div>
        <button onClick={() => onDownload(file)}>⬇️</button>
        <button onClick={() => onDelete(file.id)}>❌</button>
      </div>
    </div>
  );
}