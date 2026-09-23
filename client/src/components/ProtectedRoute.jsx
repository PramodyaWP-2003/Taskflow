import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center text-sky-200">Loading…</div>
    );

  return user ? children : <Navigate to="/login" replace />;
}