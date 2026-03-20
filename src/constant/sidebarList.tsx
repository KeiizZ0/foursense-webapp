
import { FileCheckCorner, Home, User, Users, Album } from "lucide-react";

enum Role {
  UNREGISTERED = "UNREGISTERED",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export const sidebarList = (slug: string, role: Role) => {
  const roleList = role?.toLowerCase();
  let menu: any[] = [
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
      Page: "ExportDataSiswa",
      Icon: <Album />,
      link: `/${roleList}/ExportDataKelas`,
    },
    {
      Page: "DaftarAkun",
      Icon: <Users />,
      link: `/${roleList}/daftarAkun`,
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

  if (role !== Role.ADMIN) {
    menu = menu.filter(item => item.Page !== "ExportDataSiswa" && item.Page !== "DaftarAkun");
  }

  return menu;
};
