import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // Temporarily disabled for UI demo
  // const auth = useAuth();
  // const location = useLocation();

  // if (!auth.isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children;
}
