// layout itu akan muncul di file yang sejajar dan semua folder dibawahnya

"use client";

import "../globals.css";
import { Search, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { useUserStorage } from "@/store/user.store";
import { useEffect } from "react";
import { logout } from "@/lib/helpers/auth";
import { sidebarList } from "@/constant/sidebarList";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter();
  const pathname = usePathname();
  const { myData, showMe } = useUserStorage();

  useEffect(() => {
    if (!myData) showMe();
  }, []);

  return (
    // data-theme adalah fitur dari daisyUi untuk tema dan color pallete, coba ganti ke "dark" atau tema lainnya yang terpasang di globals.css
    <div className="drawer lg:drawer-open" data-theme="light">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 flex justify-between">
          <div className="flex items-center">
            <div className="px-4">SMKN 4 Bandung</div>
          </div>
          <div className="flex gap-2.5 items-center">
            <button className="btn btn-circle border">
              <Search />
            </button>
            {/* Profile di Navbar */}
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1 rounded-full">
                {myData?.name.charAt(0)}
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <div className="flex font-medium gap-2.5 mb-2.5">
                  <div className="flex items-center justify-center bg-base-300 rounded-full w-10 h-10">
                    {myData?.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <p>{myData?.name}</p>
                    <p>{myData?.role}</p>
                  </div>
                </div>
                <li>
                  <a onClick={() => showMe()}>Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={async () => await logout()}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page content here */}
        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow p-1">
            <li key={1}>
              <label
                htmlFor="my-drawer-4"
                aria-label="open sidebar"
                role="button"
                className="btn btn-lg btn-square btn-ghost"
              >
                {/* Sidebar toggle icon */}
                <SquareChevronLeft className="is-drawer-close:hidden" />
                <SquareChevronRight className="is-drawer-open:hidden" />
              </label>
            </li>
            {/* List item */}
            {sidebarList(myData?.name!, myData?.role!).map((a, i) => (
              <li key={i + 1}>
                <button
                  className="p-3 is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip={a.Page}
                  onClick={
                    pathname !== a.link ? () => route.push(a.link) : undefined
                  }
                >
                  {/* Settings icon */}
                  {a.Icon}
                  <span className="is-drawer-close:hidden">{a.Page}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
