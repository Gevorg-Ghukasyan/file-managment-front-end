import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  // Temporarily disabled for UI demo
  // const auth = useAuth();
  // const location = useLocation();

  // if (!auth.isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children;
}
