import { Spinner } from "@/components/ui/spinner";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, RequiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (!data?.data?.email) {
      return <Navigate to={"/login"} replace />;
    }

    if (data?.data?.status !== "ACTIVE") {
      return <Navigate to="/unauthorized" />;
    }

    if (RequiredRole && RequiredRole !== data?.data?.role) {
      return <Navigate to={"/unauthorized"} replace />;
    }

    return <Component />;
  };
};