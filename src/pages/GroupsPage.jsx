export default function GroupsPage() {
  return (
    <div>
      <div className="toolbar">
        <h2>🧩 Groups</h2>
        <button className="upload-btn">➕ New Group</button>
      </div>

      <div className="empty-state">
        <div className="icon">🧩</div>
        <h3>No groups yet</h3>
        <p>Create a group to organize your files</p>
      </div>
    </div>
  );
}