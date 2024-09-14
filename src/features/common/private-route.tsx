import Spinner from "@/features/common/components/spinner";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../auth/hooks/use-auth";

export default function PrivateRoute({
  children,
  needsAdmin,
}: {
  children: ReactNode;
  needsAdmin?: boolean;
}) {
  const { status, isAdmin } = useAuth();
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-100">
        <Spinner className="size-42" />
      </div>
    );
  }

  if (status === "unauthenticated" || (!isAdmin && needsAdmin)) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}
