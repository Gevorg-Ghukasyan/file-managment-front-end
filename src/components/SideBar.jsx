import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { path: "/upload", icon: "⬆️", label: "Upload" },
  { path: "/groups", icon: "🧩", label: "Groups" },
  { path: "/", icon: "📁", label: "My Files" },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            <span className="logo-icon">☁️</span>
            <span className="logo-text">DataBox</span>
          </div>
          <button className="close-drawer" onClick={onClose}>✕</button>
        </div>

        <nav className="drawer-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="nav-indicator"></span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="drawer-footer">
          <div className="storage-section">
            <p className="storage-title">Storage</p>
            <div className="storage-bar">
              <div className="storage-used"></div>
            </div>
            <p className="storage-text">3.2 GB of 5 GB</p>
          </div>
          <button className="logout-btn">🚪 Sign Out</button>
        </div>
      </aside>
    </>
  );
}