"use client";

import { useAuth } from "@/app/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, BarChart3, User, BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { clientLogout } from "@/lib/helpers/client-auth";

export function StudentSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: BarChart3 },
    { label: "Tugas & Absensi", href: "/student/work", icon: BookOpen },
  ];

  const handleLogout = () => {
    // Clear localStorage
    clientLogout();
    // Reset zustand store
    logout();
    router.push("/");
  };

  const handleMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-800 text-white shadow-lg px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold">FourSense</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-base-100 text-base-content flex-col fixed left-0 top-0 h-screen shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">FourSense</h2>
          <p className="text-sm text-slate-300 mt-2">{user?.name}</p>
          <p className="text-xs text-slate-400">Siswa</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? "bg-blue-600 font-semibold" : "hover:bg-slate-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2 border-t border-slate-700">
          <Link
            href={`/profile/${user?.name}`}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              pathname === `/profile/${user?.name}`
                ? "bg-blue-600 font-semibold"
                : "hover:bg-slate-700"
            }`}
          >
            <User className="h-5 w-5" />
            <span>Profil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium w-full flex items-center justify-start gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-slate-800 text-white z-40 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleMenuItemClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 font-semibold"
                      : "hover:bg-slate-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-2 border-t border-slate-700">
            <Link
              href={`/profile/${user?.name}`}
              onClick={handleMenuItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === `/profile/${user?.name}`
                  ? "bg-blue-600 font-semibold"
                  : "hover:bg-slate-700"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profil</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleMenuItemClick();
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium w-full flex items-center justify-start gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
