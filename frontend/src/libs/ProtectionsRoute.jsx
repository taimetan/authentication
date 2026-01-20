import { useAuthStore } from "../stores/useAuthStore";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const VerifyEmailRoute = ({ children }) => {
  const { isAuthenticated, user, isPendingVerification } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  if (user.isVerified) {
    return <Navigate to="/" replace />;
  }

  if (!isPendingVerification) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};
