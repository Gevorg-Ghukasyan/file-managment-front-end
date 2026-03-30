import { useState } from "react";

export default function Header({ onMenuClick }) {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} title="Menu">
          ☰
        </button>
        <div className="header-divider"></div>
        <h2 className="app-title">📁 DataBox</h2>
      </div>

      <div className={`search-container ${isSearchActive ? "active" : ""}`}>
        <span className="search-icon">🔍</span>
        <input
          className="search"
          placeholder="Search files..."
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
        />
      </div>

      <div className="header-right">
        <button className="helper-btn" title="Help">❓</button>
        <button className="notification-btn" title="Notifications">
          🔔
          <span className="notification-badge">1</span>
        </button>
        <div className="user-profile">
          <div className="avatar">G</div>
          <div className="user-info">
            <span className="user-name">Gevorg</span>
            <span className="user-status">Online</span>
          </div>
        </div>
        <button className="settings-btn" title="Settings">⚙️</button>
      </div>
    </header>
  );
}