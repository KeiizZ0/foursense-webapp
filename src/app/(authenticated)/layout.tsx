"use client";

import "../globals.css";
import { Search, SquareChevronLeft, SquareChevronRight, Menu } from "lucide-react"; // TAMBAH Menu
import { useUserStorage } from "@/store/user.store";
import { useEffect, useState } from "react"; // TAMBAH useState
import { logout } from "@/lib/helpers/auth";
import { clientLogout } from "@/lib/helpers/client-auth";
import { sidebarList } from "@/constant/sidebarList";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter();
  const pathname = usePathname();
  const { myData, showMe, reset } = useUserStorage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // TAMBAH state

  useEffect(() => {
    if (!myData) showMe();
  }, []);

  // Tutup sidebar saat pindah halaman di mobile
  useEffect(() => {
    setIsMobileMenuOpen(false);
    const drawerToggle = document.getElementById('my-drawer-4') as HTMLInputElement;
    if (drawerToggle && window.innerWidth < 1024) {
      drawerToggle.checked = false;
    }
  }, [pathname]);

  return (
    <div className="drawer lg:drawer-open">
      <input 
        id="my-drawer-4" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isMobileMenuOpen}
        onChange={(e) => setIsMobileMenuOpen(e.target.checked)}
      />
      
      <div className="drawer-content">
        {/* Navbar - */}
        <nav className="navbar w-full bg-base-300 flex justify-between">
          <div className="flex items-center gap-2">
            {/* BURGER BUTTON - MUNCUL CUMA DI MOBILE */}
            <label 
              htmlFor="my-drawer-4" 
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="open sidebar"
            >
              <Menu className="h-6 w-6" />
            </label>
            <div className="px-4">SMKN 4 Bandung</div>
          </div>
          
          <div className="flex gap-2.5 items-center">
            <button className="btn btn-circle border">
              <Search />
            </button>
            
            {/* Profile Dropdown (sama seperti sebelumnya) */}
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1 rounded-full">
                {myData?.name?.charAt(0) || 'U'}
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm"
              >
                <div className="flex font-medium gap-2.5 mb-2.5">
                  <div className="flex items-center justify-center bg-base-300 rounded-full w-10 h-10">
                    {myData?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <p>{myData?.name}</p>
                    <p>{myData?.role}</p>
                  </div>
                </div>
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a href="/settings">Settings</a>
                </li>
                <li>
                  <a onClick={async () => {
                    clientLogout();
                    reset();
                    await logout();
                  }}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <div className="p-4 pt-16 lg:pt-4">{/* pt-16 untuk mobile karena navbar fixed */}
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50 lg:z-40">
        {/* Overlay - bisa diklik tutup sidebar */}
        <label 
          htmlFor="my-drawer-4" 
          aria-label="close sidebar" 
          className="drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></label>
        
        <div className="flex min-h-full flex-col items-start bg-base-200 w-72 lg:w-auto lg:is-drawer-close:w-14 lg:is-drawer-open:w-64 transition-all duration-300">
          
          {/* Header sidebar untuk mobile */}
          <div className="flex items-center justify-between w-full p-4 lg:hidden border-b border-base-300">
            <span className="font-bold">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Menu items */}
          <ul className="menu w-full grow p-2">
            {/* Toggle button - hanya di desktop */}
            <li className="hidden lg:block mb-2">
              <label
                htmlFor="my-drawer-4"
                aria-label="toggle sidebar"
                role="button"
                className="btn btn-square btn-ghost w-full justify-center"
              >
                <SquareChevronLeft className="is-drawer-close:hidden" />
                <SquareChevronRight className="is-drawer-open:hidden" />
              </label>
            </li>

            {/* List item dari sidebarList */}
            {sidebarList(myData?.name!, myData?.role!).map((a, i) => {
              const isActive = pathname === a.link;
              
              return (
                <li key={i + 1}>
                  <button
                    className={`
                      p-3 rounded-lg transition-all duration-200 w-full
                      lg:is-drawer-close:tooltip lg:is-drawer-close:tooltip-right
                      hover:bg-primary hover:text-primary-foreground hover:shadow-md
                      ${isActive ? "bg-primary/10 text-primary-foreground" : ""}
                    `}
                    data-tip={a.Page}
                    onClick={() => {
                      if (pathname !== a.link) {
                        route.push(a.link);
                      }
                      setIsMobileMenuOpen(false); // Tutup sidebar di mobile
                    }}
                  >
                    <span className="flex items-center gap-3">
                      {a.Icon}
                      <span className="lg:is-drawer-close:hidden">{a.Page}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* User info di bottom sidebar (mobile only) */}
          <div className="p-4 w-full border-t border-base-300 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-base-300 rounded-full w-10 h-10">
                {myData?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="font-medium truncate">{myData?.name}</p>
                <p className="text-sm text-gray-500 truncate">{myData?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}