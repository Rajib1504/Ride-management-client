// import ActiveTrips from "@/pages/Admin/ActiveTrips";
// import Analytics from "@/pages/Admin/Analytics";
// import CompleteTrips from "@/pages/Admin/CompleteTrips";
// import Users from "@/pages/Admin/Users";
import type { ISidebar } from "@/types";
import { lazy } from "react";
const Analytics = lazy(() => import("@/pages/Admin/Analytics"))
const CompleteTrips = lazy(() => import("@/pages/Admin/CompleteTrips"))
const Users = lazy(() => import("@/pages/Admin/Users"))
const ActiveTrips = lazy(() => import("@/pages/Admin/ActiveTrips"))
export const adminSidebarItems: ISidebar[] = [
      {
            title: "Analytics",
            items: [
                  {
                        title: "Analytics",
                        url: "/admin/analytics",
                        component: Analytics,
                  }
            ],
      },
      {
            title: "Ride Mannagement",
            items: [

                  {
                        title: "Active Trips",
                        url: '/admin/active-trips',
                        component: ActiveTrips
                  },
                  {
                        title: "Complete Trips",
                        url: "/admin/complet-trips",
                        component: CompleteTrips
                  }

            ]
      },
      {
            title: "User Mannagement",
            items: [

                  {
                        title: "All users",
                        url: "/admin/all-users",
                        component: Users
                  },

            ]
      }
]