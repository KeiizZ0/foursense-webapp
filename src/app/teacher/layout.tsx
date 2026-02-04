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
      <div className="flex w-screen h-screen bg-slate-50 overflow-hidden">
        <TeacherSidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
