
// import AccptBooking from "@/pages/Driver/AccptBooking";
import type { ISidebar } from "@/types";
import { lazy } from "react";
const AccptBooking = lazy(() => import("@/pages/Driver/AccptBooking"))
export const driverSidebarItems: ISidebar[] = [
      {
            title: "History",
            items: [
                  {
                        title: "Booking History",
                        url: "/driver/accpt-booking",
                        component: AccptBooking
                  }
            ],
      }
]