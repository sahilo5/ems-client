import { adminRoutes } from "./adminRoutes";
import { userRoutes } from "./userRoutes";
import { employeeRoutes } from "./employeeRoutes";

export const getRoutesByRole = (role: string | null) => {
  switch (role) {
    case "ADMIN":
      return adminRoutes.map(r => ({ ...r, path: `${r.path}` }));
    case "EMPLOYEE":
      return employeeRoutes.map(r => ({ ...r, path: `${r.path}` }));
    case "USER":
      return userRoutes.map(r => ({ ...r, path: `${r.path}` }));
    default:
      return [];
  }
};
