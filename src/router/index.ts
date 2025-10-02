import { createBrowserRouter } from "react-router";
import About from "@/pages/About";
import App from "@/App";
import Features from "@/pages/Features";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

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
                        Component:Features,
                        path:'features'
                  },
                  {
                        Component: Faq,
                        path:'faq'
                  },
                  {
                        Component: Contact,
                        path:'contact'
                  }
            ])
      },
      {
            Component: Login,
            path:'/login'
      },
      {
            Component: Register,
            path:'/register'
      },
])
