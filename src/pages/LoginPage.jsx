import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await auth.login({ userNameOrEmail, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>
        <p className="auth-subtitle">Login with your credentials to access the file manager.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username or Email
            <input
              type="text"
              value={userNameOrEmail}
              onChange={(e) => setUserNameOrEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
