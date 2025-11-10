import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import About from "@/pages/About";
import App from "@/App";
import Features from "@/pages/Features";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoute";
import { adminSidebarItems } from "./adminSidebarItems";
import { riderSidebarItems } from "./riderSidebarItems";
import { driverSidebarItems } from "./driverSideBarItems";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import Unauthorised from "@/pages/Unauthorised";

export const router = createBrowserRouter([
      {
            Component: App,
            path: '/',
            children: ([
                  {
                        Component: Home,
                        index: true
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
                        Component: withAuth(Contact),
                        path: 'contact'
                  }, {
                        Component: Login,
                        path: '/login'
                  }, {
                        Component: Register,
                        path: '/register'
                  },
                  {
                        Component: Unauthorised,
                        path: '/unauthorized'
                  },
            ])
      },
      {
            Component: withAuth(DashboardLayout, role.admin as TRole),
            path: "/admin",
            children: [
                  { index: true, element: React.createElement(Navigate, { to: "/admin/analytics" }) },
                  ...generateRoutes(adminSidebarItems)
            ]
      },
      {
            Component: withAuth(DashboardLayout, role.rider as TRole),
            path: "/rider",
            children: [{ index: true, element: React.createElement(Navigate, { to: "/rider/accpt-booking" }) }, ...generateRoutes(riderSidebarItems)]
      },
      {
            Component: withAuth(DashboardLayout, role.driver as TRole),
            path: "/driver",
            children: [{ index: true, element: React.createElement(Navigate, { to: "/driver/accpt-booking" }) }, ...generateRoutes(driverSidebarItems)]
      },



])


