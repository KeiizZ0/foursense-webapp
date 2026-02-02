'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, TrendingUp } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-slate-600">Analisis data kehadiran dan progress siswa</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rata-rata Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-green-600">Naik 2% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Penyelesaian Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-xs text-slate-600">Rata-rata kelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Siswa Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">31/32</div>
            <p className="text-xs text-slate-600">1 tidak aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Siti Nurhaliza - 95%', 'Rina Wijaya - 92%', 'Ahmad Wirawan - 90%'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50">
                <span className="text-sm">{name}</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Siswa Membutuhkan Perhatian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Doni Pratama - 75%', 'Eka Susanto - 78%'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-orange-50">
                <span className="text-sm">{name}</span>
                <Button size="sm" variant="outline" className="text-xs">
                  Hubungi
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
