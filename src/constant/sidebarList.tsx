import { Role } from "@/type/user.type";
import { FileCheckCorner, Home, User, Users } from "lucide-react";

export const sidebarList = (name: string, role: Role) => {
  const menu = [
    {
      Page: "Dashboard",
      Icon: <Home />,
      link: `/${role}/dashboard`,
    },
    {
      Page: "Absence",
      Icon: <FileCheckCorner />,
      link: `/${role}/absence`,
    },
    {
      Page: "Profile",
      Icon: <User />,
      link: `/profile/${name}`,
    },
  ];

  if (role === "teacher") {
    menu.splice(2, 0, {
      Page: "Data Siswa",
      Icon: <Users />,
      link: `/teacher/DataSiswa`,
    });
  }

  return menu;
};
