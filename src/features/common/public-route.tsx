import Spinner from "@/features/common/components/spinner";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../auth/hooks/use-auth";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { status, isEmployee, isAdmin } = useAuth();
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-100">
        <Spinner className="size-42" />
      </div>
    );
  }

  if (status === "authenticated" && (isEmployee || isAdmin)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
