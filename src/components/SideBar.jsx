import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { path: "/", icon: "📁", label: "My Files" },
  { path: "/groups", icon: "🧩", label: "Groups" },
  { path: "/upload", icon: "⬆️", label: "Upload" },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const storageInfo = (() => {
    const stored = localStorage.getItem("storage_info");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing storage info:", e);
        return null;
      }
    }
    return null;
  })();

  const handleLogout = () => {
    auth.logout();
    onClose();
    navigate("/login", { replace: true });
  };

  const getStoragePercentage = () => {
    if (!storageInfo) return 0;
    return Math.min(100, (storageInfo.percentage || 0));
  };

  const getStorageText = () => {
    if (!storageInfo) return "No data";
    const used = (storageInfo.used / 1024 / 1024).toFixed(2);
    const available = (storageInfo.available / 1024 / 1024).toFixed(2);
    return `${used} MB of ${available} MB`;
  };

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
              <div 
                className="storage-used"
                style={{ width: `${getStoragePercentage()}%` }}
              ></div>
            </div>
            <p className="storage-text">{getStorageText()}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
        </div>
      </aside>
    </>
  );
}
