import { role } from "@/constants/role";
import { adminSidebarItems } from "@/router/adminSidebarItems";
import { driverSidebarItems } from "@/router/driverSideBarItems";
import { riderSidebarItems } from "@/router/riderSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userrole: TRole) => {
      switch (userrole) {
            case role.admin:
                  return [...adminSidebarItems];// if you wnat you can show the driver sidebar routes or user sidebar routes [...adminSidebarItems,...riderSidebarItems]
            case role.driver:
                  return [...driverSidebarItems];
            case role.rider:
                  return [...riderSidebarItems];
            default:
                  return [];
      }

}