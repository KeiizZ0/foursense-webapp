'use client'

import React from "react"

import { AuthGuard } from '@/components/auth-guard'
import { StudentSidebar } from '@/components/student-sidebar'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="siswa">
      <div className="flex h-screen bg-slate-100">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
