import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../auth/authService";

function ProtectedRoute({ children, role }) {
  const userRole = getRoleFromToken();

  if (!userRole) return <Navigate to="/" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;
