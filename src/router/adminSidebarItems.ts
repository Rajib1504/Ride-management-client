import ActiveTrips from "@/pages/Admin/ActiveTrips";
import Analytics from "@/pages/Admin/Analytics";
import CompleteTrips from "@/pages/Admin/CompleteTrips";
import Users from "@/pages/Admin/Users";
import type { ISidebar } from "@/types";

export const adminSidebarItems: ISidebar[] = [
      {
            title: "Analytics",
            items: [
                  {
                        title: "Analytics",
                        url: "/admin/analytics",
                        Component: Analytics
                  }
            ],
      },
      {
            title: "Ride Mannagement",
            items: [

                  {
                        title: "Active Trips",
                        url: '/admin/active-trips',
                        Component: ActiveTrips
                  },
                  {
                        title: "Complete Trips",
                        url: "/admin/complet-trips",
                        Component: CompleteTrips
                  }

            ]
      },
      {
            title: "User Mannagement",
            items: [

                  {
                        title: "All users",
                        url: "/admin/all-users",
                        Component: Users
                  },

            ]
      }
]