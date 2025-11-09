
// import BookingHistory from "@/pages/Rider/BookingHistory";
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
                  }
            ],
      }
]