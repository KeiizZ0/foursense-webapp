
import { FileCheckCorner, Home, User, Users } from "lucide-react";

enum Role {
  UNREGISTERED = "UNREGISTERED",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export const sidebarList = (slug: string, role: Role) => {
  const roleList = role?.toLowerCase();
  const menu = [
    {
      Page: "Dashboard",
      Icon: <Home />,
      link: `/${roleList}/dashboard`,
    },
    {
      Page: "Absence",
      Icon: <FileCheckCorner />,
      link: `/${roleList}/absence`,
    },
    {
      Page: "Profile",
      Icon: <User />,
      link: `/profile/${slug}`,
    },
  ];

  if (role === "TEACHER") {
    menu.splice(2, 0, {
      Page: "Data Siswa",
      Icon: <Users />,
      link: `/teacher/DataSiswa`,
    });
  }

  return menu;
};