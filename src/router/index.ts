import { createBrowserRouter } from "react-router";
import About from "@/pages/About";
import App from "@/App";

export const router = createBrowserRouter([
      {
            Component: App,
            path: '/',
            children: ([
                  {
                        Component: About,
                        path: 'about'
                  }
            ])
      }
])
