import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { regularUserSidebarItems } from "@/routes/regularUserSidebarItems";
import type { ISidebarItem } from "@/types";

export const getSidebarItems = (userRoles: string[] | undefined): ISidebarItem[] => {
  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  // If user has SUPER_ADMIN or ADMIN role, they ONLY see admin sidebar
  if (
    userRoles.includes(role.superAdmin) ||
    userRoles.includes(role.admin)
  ) {
    return adminSidebarItems;
  }

  // For CW, CD, VE users, return regular dashboard items
  return regularUserSidebarItems;
};
