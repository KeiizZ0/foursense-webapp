"use client";

import "../globals.css";
import { Search, SquareChevronLeft, SquareChevronRight, Menu, LogOut } from "lucide-react";
import { useUserStorage } from "@/store/user.store";
import Link from "next/link";
import Image from "next/image"; 
import { useEffect, useState } from "react";
import { logout } from "@/lib/helpers/auth";
import { clientLogout } from "@/lib/helpers/client-auth";
import { sidebarList } from "@/constant/sidebarList";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/type/user.type";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter();
  const pathname = usePathname();
  const { myData, showMe, reset } = useUserStorage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!myData) showMe();
  }, [myData, showMe]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    const drawerToggle = document.getElementById('my-drawer-4') as HTMLInputElement;
    if (drawerToggle && window.innerWidth < 1024) {
      drawerToggle.checked = false;
    }
  }, [pathname]);

  const handleLogout = async () => {
    clientLogout();
    reset();
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input 
        id="my-drawer-4" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isMobileMenuOpen}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsMobileMenuOpen(e.target.checked)}
      />
      
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-gray-300 flex justify-between">
          <div className="flex items-center gap-2">
            <label 
              htmlFor="my-drawer-4" 
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="open sidebar"
            >
              <Menu className="h-6 w-6" />
            </label>
           
            {/* Logo dan teks SMKN 4 Bandung */}
            <div className="flex items-center gap-3 px-4">
              {/* Foto/Logo */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src="/logo.png" 
                  alt="Logo SMKN 4 Bandung"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-semibold text-base">SMKN 4 Bandung</span>
            </div>
          </div>
          
          <div className="flex gap-2.5 items-center">
            
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
                  <Link href={`/profile/${myData?.name}`}>Profile</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="p-4 pt-16 lg:pt-4">
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50 lg:z-40">
        <label 
          htmlFor="my-drawer-4" 
          aria-label="close sidebar" 
          className="drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></label>
        
        <div className="flex min-h-full flex-col bg-gray-800 text-gray w-72 lg:w-auto lg:is-drawer-close:w-fit lg:is-drawer-open:w-64 transition-all duration-300">
          
          {/* Header mobile */}
          <div className="flex items-center justify-between w-full p-4 lg:hidden border-b border-gray-700">
            <span className="font-bold text-white">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-sm btn-circle btn-ghost text-white"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* FourSense + identitas (desktop & mobile) */}
          <div className="flex flex-col items-center text-center p-4 border-b border-gray-700 shrink-0 is-drawer-close:hidden">
            <p className="font-bold text-lg text-white">FourSense</p>
            <p className="font-medium text-sm text-white mt-1">{myData?.name}</p>
            <p className="text-xs text-gray-400">{myData?.role}</p>
          </div>

          {/* Menu items */}
          <ul className="menu w-full grow p-2">
            {/* Toggle button desktop */}
            <li className="hidden lg:block mb-2">
              <label
                htmlFor="my-drawer-4"
                aria-label="toggle sidebar"
                role="button"
                className="btn btn-square btn-ghost w-full justify-center text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <SquareChevronLeft className="is-drawer-close:hidden" />
                <SquareChevronRight className="is-drawer-open:hidden" />
              </label>
            </li>

            {/* Menu list */}
            {sidebarList(myData?.name!, myData?.role! as Role).map((item, index: number) => {
              const isActive = pathname === item.link;
              return (
                <li key={index}>
                  <button
                    className={`
                      p-3 rounded-lg transition-all duration-200 w-full
                      lg:is-drawer-close:tooltip lg:is-drawer-close:tooltip-right
                      ${isActive 
                        ? "bg-blue-600 text-white font-medium" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                    data-tip={item.Page}
                    onClick={() => {
                      if (pathname !== item.link) route.push(item.link);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      {item.Icon}
                      <span className="lg:is-drawer-close:hidden">{item.Page}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Logout button untuk mobile dan desktop */}
          <div className="p-3 border-t border-gray-700">
            <button
              className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
              onClick={handleLogout}
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                <span className="lg:is-drawer-close:hidden">Logout</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}