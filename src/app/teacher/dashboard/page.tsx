'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckCircle2, AlertCircle, Clock, BarChart3, TrendingDown } from 'lucide-react'

export default function TeacherDashboard() {
  const attendanceStats = {
    todayPresent: 124,
    todayAbsent: 18,
    todayLate: 12,
    averageAttendance: 92,
  }

  const classSummary = [
    { major: 'RPL', totalStudents: 32, present: 30, absent: 2, late: 0 },
    { major: 'TKJ', totalStudents: 30, present: 28, absent: 1, late: 1 },
    { major: 'MM', totalStudents: 28, present: 26, absent: 2, late: 0 },
    { major: 'AP', totalStudents: 31, present: 29, absent: 2, late: 0 },
    { major: 'AKL', totalStudents: 29, present: 27, absent: 0, late: 2 },
    { major: 'BDP', totalStudents: 24, present: 24, absent: 0, late: 0 },
  ]

  const recentAlerts = [
    { name: 'Ahmad Wirawan', major: 'RPL 1', status: 'Absen', date: 'Hari ini' },
    { name: 'Siti Nurhaliza', major: 'TKJ 2', status: 'Terlambat', date: 'Hari ini' },
    { name: 'Budi Santoso', major: 'MM 1', status: 'Absen', date: 'Hari ini' },
    { name: 'Dewi Kusuma', major: 'AKL 3', status: 'Terlambat', date: 'Hari ini' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard Monitoring</h1>
        <p className="text-slate-600">Pantau kehadiran siswa SMKN 4 Bandung</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.todayPresent}</div>
            <p className="text-xs text-slate-600">siswa hadir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absen Hari Ini</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.todayAbsent}</div>
            <p className="text-xs text-slate-600">siswa absen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.todayLate}</div>
            <p className="text-xs text-slate-600">siswa terlambat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Hadir</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.averageAttendance}%</div>
            <p className="text-xs text-slate-600">bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Kehadiran Per Jurusan</CardTitle>
          <CardDescription>Data kehadiran hari ini untuk semua jurusan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="text-left py-2 px-2 font-semibold">Jurusan</th>
                  <th className="text-center py-2 px-2 font-semibold">Total Siswa</th>
                  <th className="text-center py-2 px-2 font-semibold text-green-600">Hadir</th>
                  <th className="text-center py-2 px-2 font-semibold text-red-600">Absen</th>
                  <th className="text-center py-2 px-2 font-semibold text-yellow-600">Terlambat</th>
                  <th className="text-center py-2 px-2 font-semibold">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {classSummary.map((item, idx) => {
                  const percentage = Math.round(((item.present + item.late) / item.totalStudents) * 100)
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium">{item.major}</td>
                      <td className="text-center py-3 px-2">{item.totalStudents}</td>
                      <td className="text-center py-3 px-2 text-green-600 font-semibold">{item.present}</td>
                      <td className="text-center py-3 px-2 text-red-600 font-semibold">{item.absent}</td>
                      <td className="text-center py-3 px-2 text-yellow-600 font-semibold">{item.late}</td>
                      <td className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Alert - Siswa Absen dan Terlambat
          </CardTitle>
          <CardDescription>Siswa yang tidak hadir atau terlambat hari ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    alert.status === 'Absen' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm">{alert.name}</p>
                    <p className="text-xs text-slate-600">{alert.major}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        alert.status === 'Absen'
                          ? 'bg-red-200 text-red-700'
                          : 'bg-yellow-200 text-yellow-700'
                      }`}
                    >
                      {alert.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{alert.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">Semua siswa hadir hari ini!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
