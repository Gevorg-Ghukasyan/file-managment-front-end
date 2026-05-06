import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LogoutPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.logout();
    navigate("/login", { replace: true });
  }, [auth, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Signing out…</h2>
      </div>
    </div>
  );
}
