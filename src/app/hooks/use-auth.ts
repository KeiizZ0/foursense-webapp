'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  role: 'admin' | 'guru' | 'siswa'
  name: string
  nis?: string
  kelas?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Cek user dari localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('todos')
    localStorage.removeItem('attendance')
    setUser(null)
    router.push('/')
  }

  return { user, loading, logout }
}
