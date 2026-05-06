import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserFromToken } from "../utils/auth";

export default function Header({ onMenuClick }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const tokenUser = getUserFromToken();

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  const displayName =
    auth.user?.userName ||
    auth.user?.email ||
    tokenUser?.userName ||
    tokenUser?.email ||
    "User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} title="Menu">
          ☰
        </button>
        <div className="header-divider"></div>
        <h2 className="app-title">📁 DataBox</h2>
      </div>

      <div className="header-right">
        <button className="helper-btn" title="Help">❓</button>
        <button className="notification-btn" title="Notifications">
          🔔
        </button>
        <div className="user-profile">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-status">Online</span>
          </div>
        </div>
        <button className="settings-btn" onClick={handleLogout} title="Sign out">
          🚪
        </button>
      </div>
    </header>
  );
}