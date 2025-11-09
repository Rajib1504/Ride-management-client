import type { ComponentType } from "react";

export interface ISidebar {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}
export type TRole = "Admin" | "Driver" | "Rider";
