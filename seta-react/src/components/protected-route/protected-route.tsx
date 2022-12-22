import { Navigate } from "react-router-dom";
import storageService from "../../services/storage.service";

export const ProtectedRoute = ({ children }) => {
  if (!storageService.isLoggedIn()) {
    // user is not authenticated
    return <Navigate to="/seta-ui/login" />;
  }
  return children;
};