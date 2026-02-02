'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, FileText, BarChart3, Shield } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-600">
          Kelola akses ke semua sistem - Guru, Siswa, dan Monitoring Keseluruhan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-slate-600 mt-1">Admin, Guru, Siswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-slate-600 mt-1">Admin session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Data Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">100%</div>
            <p className="text-xs text-slate-600 mt-1">All systems healthy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Connected</div>
            <p className="text-xs text-slate-600 mt-1">Backend ready</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Akses Guru
            </CardTitle>
            <CardDescription>
              Portal monitoring kehadiran dan data siswa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Sebagai Admin, Anda dapat mengakses dashboard guru untuk:
            </p>
            <ul className="text-sm space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Monitoring kehadiran siswa per kelas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Melihat statistik kehadiran dan laporan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Mengelola data siswa per jurusan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Update status kehadiran siswa</span>
              </li>
            </ul>
            <Link href="/admin/guru" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Akses Guru Portal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Akses Siswa
            </CardTitle>
            <CardDescription>
              Portal todo list dan absensi siswa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Sebagai Admin, Anda dapat mengakses dashboard siswa untuk:
            </p>
            <ul className="text-sm space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Membuat dan mengelola todo list harian</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Melakukan absensi dengan geolocation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Melihat riwayat kehadiran</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Monitoring dashboard statistik pribadi</span>
              </li>
            </ul>
            <Link href="/admin/siswa" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Akses Siswa Portal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Configuration dan status sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-slate-900">Application</p>
              <p className="text-slate-600">FourSense v1.0</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-900">Database</p>
              <p className="text-slate-600">LocalStorage + API Backend</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-900">Backend</p>
              <p className="text-slate-600">Laravel (Connected)</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-900">API Key Status</p>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
