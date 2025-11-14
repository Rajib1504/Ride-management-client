// src/utils/withAuth.tsx
import { Spinner } from "@/components/ui/spinner";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, RequiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    // 1. Handle Loading State FIRST
    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      );
    }

    // 2. Handle Authentication (User not logged in)
    // This is now safe because we know isLoading is false.
    if (!data?.data?.email) {
      return <Navigate to={"/login"} replace />;
    }

    // 3. Handle Authorization (User has the wrong role)
    if (RequiredRole && RequiredRole !== data?.data?.role) {
      return <Navigate to={"/unauthorized"} replace />;
    }

    // 4. User is authenticated and authorized
    return <Component />;
  };
};
