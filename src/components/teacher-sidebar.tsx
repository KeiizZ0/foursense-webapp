'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter, usePathname } from 'next/navigation'
import { BookOpen, Users, BarChart3, Settings, LogOut, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function TeacherSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard', icon: BarChart3 },
    { label: 'Data Siswa', href: '/teacher/students', icon: Users },
    { label: 'Kehadiran', href: '/teacher/attendance', icon: ClipboardList },
    { label: 'Laporan', href: '/teacher/reports', icon: BarChart3 },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-blue-600">FourSense</h2>
        <p className="text-sm text-slate-600 mt-1">{user?.name}</p>
        <p className="text-xs text-slate-500">Guru</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <Link
          href="/teacher/settings"
          className="flex items-center gap-2 px-4 py-2 text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <Settings className="h-4 w-4" />
          <span>Pengaturan</span>
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
