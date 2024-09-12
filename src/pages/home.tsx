import useAuth from "@/features/auth/hooks/use-auth";
import Spinner from "@/features/common/components/spinner";
import { Navigate } from "react-router-dom";

export default function Home() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner className="size-52" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <Navigate to="/inventory" />;
}
