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
            path: "/admin",
            children: [
                  { index: true, element: React.createElement(Navigate, { to: "/admin/analytics" }) },
                  ...generateRoutes(adminSidebarItems)
            ]
      },
      {
            Component: DashboardLayout,
            path: "/rider",
            children: [{ index: true, element: React.createElement(Navigate, { to: "/rider/accpt-booking" }) }, ...generateRoutes(riderSidebarItems)]
      },
      {
            Component: DashboardLayout,
            path: "/driver",
            children: [{ index: true, element: React.createElement(Navigate, { to: "/driver/accpt-booking" }) }, ...generateRoutes(driverSidebarItems)]
      }


])


