import { createBrowserRouter } from "react-router";
import About from "@/pages/About";
import App from "@/App";
import Features from "@/pages/Features";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BookRide from "@/pages/User/BookRide";
import AccptBooking from "@/pages/Rider/AccptBooking";
import { generateRoutes } from "@/utils/generateRoute";
import { adminSidebarItems } from "./adminSidebarItems";

export const router = createBrowserRouter([
      {
            Component: App,
            path: '/',
            children: ([
                  {
                        Component: Home,
                        path: ''
                  },
                  {
                        Component: About,
                        path: 'about'
                  },
                  {
                        Component: Features,
                        path: 'features'
                  },
                  {
                        Component: Faq,
                        path: 'faq'
                  },
                  {
                        Component: Contact,
                        path: 'contact'
                  }, {
                        Component: Login,
                        path: '/login'
                  }, {
                        Component: Register,
                        path: '/register'
                  },
            ])
      },
      {
            Component: DashboardLayout,
            path: '/admin',
            children: [...generateRoutes(adminSidebarItems)]
      },
      {
            Component: DashboardLayout,
            path: "/user",
            children: [
                  {
                        Component: BookRide,
                        path: 'bookride'
                  }
            ]
      },
      {
            Component: DashboardLayout,
            path: "/rider",
            children: [
                  {
                        Component: AccptBooking,
                        path: "accptbooking"
                  }
            ]
      }


])
