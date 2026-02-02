'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BarChart3, Calendar, Clipboard } from 'lucide-react'

export default function AdminGuruAccess() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Guru Portal (Admin Access)</h1>
        <p className="text-slate-600">
          Akses dashboard guru untuk monitoring kehadiran dan data siswa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Dashboard Guru
            </CardTitle>
            <CardDescription>
              Overview kehadiran dan statistik harian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Lihat ringkasan kehadiran hari ini, alert siswa absen/terlambat, dan statistik per jurusan.
            </p>
            <Link href="/teacher/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Akses Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Data Kehadiran
            </CardTitle>
            <CardDescription>
              Detail kehadiran per kelas dan tanggal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Filter kehadiran berdasarkan jurusan, kelas, tingkat, dan tanggal. Edit status siswa secara manual.
            </p>
            <Link href="/teacher/attendance">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Akses Kehadiran
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Data Siswa
            </CardTitle>
            <CardDescription>
              Informasi lengkap siswa per kelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Lihat daftar siswa per kelas dengan statistik kehadiran dan performa.
            </p>
            <Link href="/teacher/students">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Akses Data Siswa
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-orange-600" />
              Laporan Statistik
            </CardTitle>
            <CardDescription>
              Analisis performa kelas dan siswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Laporan bulanan kehadiran, siswa top performer, dan siswa yang perlu perhatian.
            </p>
            <Link href="/teacher/reports">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Akses Laporan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Info Guru Portal</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            Sebagai Admin, Anda dapat menjelajahi semua fitur guru untuk monitoring dan verifikasi sistem:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dashboard monitoring kehadiran real-time</li>
            <li>Filtering kehadiran berdasarkan jurusan, kelas, tingkat, dan tanggal</li>
            <li>Edit manual status kehadiran siswa (Alpha, Izin, Sakit)</li>
            <li>Statistik rinci per kelas dan per siswa</li>
            <li>Identifikasi siswa top performer dan yang perlu perhatian</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
