import useAuth from "@/features/auth/hooks/use-auth";
import { Spinner } from "flowbite-react";
import { Navigate } from "react-router-dom";

export default function Home() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner size={50} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <Navigate to="/inventory" />;
}
