import FileItem from "./FileItem";

export default function FileList({ files, onDelete, onDownload }) {
  return (
    <div>
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}