import { FileCheckCorner, Home, User } from "lucide-react";

export const sidebarList = (name: string, role: string) => [
  {
    Page: "Dashboard",
    Category: "Dashboard",
    Icon: <Home />,
    link: `/${role}/dashboard`,
  },
  {
    Page: "Absence",
    Category: "Absence",
    Icon: <FileCheckCorner />,
    link: `/${role}/absence`,
  },
  {
    Page: "Profile",
    Category: "Profile",
    Icon: <User />,
    link: `/profile/${name}`,
  },
];
