import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import LoadingOverlay from "./LoadingOverlay";
import { useAuth } from "../Hooks/authHooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingOverlay message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};