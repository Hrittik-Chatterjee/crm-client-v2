import type { ComponentType } from "react";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: ComponentType;
  component?: ComponentType;
  items?: SidebarItem[];
}

export function generateRoutes(sidebarItems: SidebarItem[]) {
  const routes: Array<{
    path: string;
    Component: ComponentType;
  }> = [];

  sidebarItems.forEach((item) => {
    if (item.component) {
      const path = item.url.split("/").pop() || "";
      routes.push({
        path,
        Component: item.component,
      });
    }

    if (item.items) {
      item.items.forEach((subItem) => {
        if (subItem.component) {
          const path = subItem.url.split("/").pop() || "";
          routes.push({
            path,
            Component: subItem.component,
          });
        }
      });
    }
  });

  return routes;
}
