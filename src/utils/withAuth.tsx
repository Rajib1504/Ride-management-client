import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, RequiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);
//     console.log(data);
    if (!data?.data?.email) {
      return <Navigate to={"/login"} />;
    }
    if (!isLoading && RequiredRole && RequiredRole !== data?.data?.role) {
      return <Navigate to={"/unauthorized"} />;
    }
    return <Component />;
  };
};
