'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckSquare, MapPin, BarChart3, History } from 'lucide-react'

export default function AdminSiswaAccess() {
  const { user } = useAuth()

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Siswa Portal (Admin Access)</h1>
        <p className="text-slate-600">
          Akses dashboard siswa untuk todo list dan absensi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Dashboard Siswa
            </CardTitle>
            <CardDescription>
              Overview profil dan statistik kehadiran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Lihat dashboard siswa dengan profil, status hari ini, dan statistik kehadiran.
            </p>
            <Link href="/student/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Akses Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              Todo List
            </CardTitle>
            <CardDescription>
              Manajemen tugas harian siswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Buat, kelola, dan tandai tugas selesai. Setiap tugas melalui AI check sebelum disimpan.
            </p>
            <Link href="/student/todos">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Akses Todo List
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Absensi
            </CardTitle>
            <CardDescription>
              Sistem absensi dengan geolocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Lakukan absensi setelah menyelesaikan todo list. Geolocation akan diminta untuk keamanan.
            </p>
            <Link href="/student/attendance">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Akses Absensi
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600" />
              Riwayat
            </CardTitle>
            <CardDescription>
              History kehadiran dan todo list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Lihat riwayat kehadiran dan todo list yang telah diselesaikan beserta detail lengkapnya.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Info Siswa Portal</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-800 space-y-2">
          <p>
            Sebagai Admin, Anda dapat menjelajahi semua fitur siswa untuk testing dan verifikasi:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Membuat todo list dengan AI validation</li>
            <li>Menandai todo sebagai selesai</li>
            <li>Melakukan absensi dengan request geolocation</li>
            <li>Melihat status kehadiran hari ini dan riwayat</li>
            <li>Statistik kehadiran dan penyelesaian tugas</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fitur Utama Sistem</CardTitle>
          <CardDescription>Overview cara kerja sistem FourSense</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-900">1. Todo List Requirement</p>
              <p className="text-blue-800">
                Siswa harus membuat dan menyelesaikan todo list sebelum dapat absensi.
              </p>
            </div>
            <div className="space-y-2 p-3 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-900">2. AI Validation</p>
              <p className="text-green-800">
                Setiap todo melalui proses AI check untuk memastikan kualitas tugas.
              </p>
            </div>
            <div className="space-y-2 p-3 bg-red-50 rounded-lg">
              <p className="font-semibold text-red-900">3. Geolocation Tracking</p>
              <p className="text-red-800">
                Absensi menyimpan latitude/longitude untuk keamanan dan verifikasi lokasi.
              </p>
            </div>
            <div className="space-y-2 p-3 bg-purple-50 rounded-lg">
              <p className="font-semibold text-purple-900">4. API Integration</p>
              <p className="text-purple-800">
                Semua data tersinkronisasi dengan backend Laravel untuk persistensi data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
