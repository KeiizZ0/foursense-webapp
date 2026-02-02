'use client'

import React from "react"

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Users, ClipboardList, BarChart3 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">FourSense</h1>
          <p className="text-sm text-slate-400 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/guru">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-800"
            >
              <Users className="h-4 w-4 mr-3" />
              Guru Access
            </Button>
          </Link>
          <Link href="/admin/siswa">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-800"
            >
              <Users className="h-4 w-4 mr-3" />
              Siswa Access
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Selamat datang, {user.name}
              </h2>
              <p className="text-sm text-slate-600">Admin Dashboard</p>
            </div>
            <div className="text-sm text-slate-600">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  )
}
