'use client'

import React from "react"

import { AuthGuard } from '@/components/auth-guard'
import { TeacherSidebar } from '@/components/teacher-sidebar'

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="guru">
      <div className="flex h-screen bg-slate-100">
        <TeacherSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
