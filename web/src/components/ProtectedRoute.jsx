import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../Hooks/authHooks/useAuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // Only redirect if explicitly not authenticated
  if (!isAuthenticated && !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};