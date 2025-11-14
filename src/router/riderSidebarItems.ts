
// import BookingHistory from "@/pages/Rider/BookingHistory";
import RequestRidePage from "@/pages/Rider/RequestRide";
import type { ISidebar } from "@/types";
import { lazy } from "react";
const BookingHistory = lazy(() => import("@/pages/Rider/BookingHistory"))
export const riderSidebarItems: ISidebar[] = [
      {
            title: "History",
            items: [
                  {
                        title: "Booking History",
                        url: "/rider/accpt-booking",
                        component: BookingHistory
                  },
                  {
                        title: "Request Ride",
                        url: "/rider/request-ride",
                        component: RequestRidePage
                  },
            ],
      }
]