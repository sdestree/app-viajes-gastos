import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
