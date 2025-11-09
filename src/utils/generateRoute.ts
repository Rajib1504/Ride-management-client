import { type ISidebar } from './../types/index';
export const generateRoutes = (sidebarItems: ISidebar[]) => {
      return sidebarItems.flatMap(sections => sections.items.map(route => ({
            path: route.url,
            Component: route.component
      })));
}