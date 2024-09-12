import { Spinner } from "flowbite-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../auth/hooks/use-auth";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-100">
        <Spinner />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/inventory" />;
  }

  return children;
}
