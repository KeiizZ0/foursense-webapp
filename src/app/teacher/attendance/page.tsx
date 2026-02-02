'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Filter, ChevronDown } from 'lucide-react'

export default function AttendancePage() {
  const [selectedTingkat, setSelectedTingkat] = useState<string>('')
  const [selectedJurusan, setSelectedJurusan] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [dateFilter, setDateFilter] = useState('2025-11-18')
  const [statusChanges, setStatusChanges] = useState<Record<string, string>>({})

  const tingkatList = ['10', '11', '12']

  const jurusanList = [
    { id: 'rpl', name: 'RPL (Rekayasa Perangkat Lunak)' },
    { id: 'tbsm', name: 'TBSM (Teknik & Bisnis Sepeda Motor)' },
    { id: 'dpb', name: 'DPB (Desain Pemodelan & Informasi Bangunan)' },
    { id: 'tk', name: 'TK (Teknik Komputer & Jaringan)' },
    { id: 'mm', name: 'MM (Multimedia)' },
    { id: 'tl', name: 'TL (Teknik Logistik)' },
  ]

  const classMap: Record<string, Array<{ id: string; name: string }>> = {
    rpl: [
      { id: 'rpl-1', name: 'RPL 1' },
      { id: 'rpl-2', name: 'RPL 2' },
      { id: 'rpl-3', name: 'RPL 3' },
    ],
    tbsm: [
      { id: 'tbsm-1', name: 'TBSM 1' },
      { id: 'tbsm-2', name: 'TBSM 2' },
    ],
    dpb: [
      { id: 'dpb-1', name: 'DPB 1' },
      { id: 'dpb-2', name: 'DPB 2' },
    ],
    tk: [
      { id: 'tk-1', name: 'TK 1' },
      { id: 'tk-2', name: 'TK 2' },
      { id: 'tk-3', name: 'TK 3' },
    ],
    mm: [
      { id: 'mm-1', name: 'MM 1' },
      { id: 'mm-2', name: 'MM 2' },
    ],
    tl: [
      { id: 'tl-1', name: 'TL 1' },
    ],
  }

  const getAttendanceData = (classId: string, date: string) => {
    const attendanceByClass: Record<string, Array<{ id: string; name: string; status: string; time?: string; note?: string }>> = {
      'rpl-1': [
        { id: '1', name: 'Ahmad Wirawan', status: 'present', time: '07:15' },
        { id: '2', name: 'Siti Nurhaliza', status: 'present', time: '07:20' },
        { id: '3', name: 'Budi Santoso', status: 'late', time: '07:45' },
        { id: '4', name: 'Rina Wijaya', status: 'present', time: '07:10' },
        { id: '5', name: 'Doni Pratama', status: 'alpha' },
        { id: '6', name: 'Eka Susanto', status: 'present', time: '07:18' },
        { id: '7', name: 'Farah Annisa', status: 'present', time: '07:18' },
        { id: '8', name: 'Gito Pratama', status: 'present', time: '07:22' },
        { id: '9', name: 'Hendra Wijaya', status: 'alpha' },
      ],
      'rpl-2': [
        { id: '1', name: 'Hendra Wijaya', status: 'present', time: '07:12' },
        { id: '2', name: 'Indah Lestari', status: 'present', time: '07:16' },
        { id: '3', name: 'Jaka Semadi', status: 'alpha' },
        { id: '4', name: 'Kiki Amelia', status: 'present', time: '07:14' },
        { id: '5', name: 'Lina Permata', status: 'late', time: '07:50' },
        { id: '6', name: 'Marta Sihombing', status: 'present', time: '07:19' },
      ],
      'rpl-3': [
        { id: '1', name: 'Nando Kusuma', status: 'present', time: '07:13' },
        { id: '2', name: 'Olivia Chen', status: 'present', time: '07:17' },
        { id: '3', name: 'Pandra Yusuf', status: 'alpha' },
        { id: '4', name: 'Qori Maulana', status: 'present', time: '07:21' },
        { id: '5', name: 'Rini Wijaya', status: 'alpha' },
      ],
      'tbsm-1': [
        { id: '1', name: 'Sama Setya', status: 'present', time: '07:11' },
        { id: '2', name: 'Tania Kusuma', status: 'present', time: '07:15' },
        { id: '3', name: 'Ulum Hartanto', status: 'late', time: '07:48' },
      ],
      'tbsm-2': [
        { id: '1', name: 'Vina Marlina', status: 'present', time: '07:20' },
        { id: '2', name: 'Wida Putri', status: 'alpha' },
        { id: '3', name: 'Xenia Rahma', status: 'present', time: '07:14' },
      ],
      'dpb-1': [
        { id: '1', name: 'Yusuf Pratama', status: 'present', time: '07:16' },
        { id: '2', name: 'Zainab Kusuma', status: 'alpha' },
      ],
      'dpb-2': [
        { id: '1', name: 'Alex Wijaya', status: 'present', time: '07:19' },
        { id: '2', name: 'Beta Kusuma', status: 'present', time: '07:21' },
      ],
      'tk-1': [
        { id: '1', name: 'Citra Dewi', status: 'present', time: '07:12' },
        { id: '2', name: 'Dimas Pratama', status: 'late', time: '07:55' },
      ],
      'tk-2': [
        { id: '1', name: 'Elsa Wijaya', status: 'present', time: '07:18' },
      ],
      'tk-3': [
        { id: '1', name: 'Faiz Rahman', status: 'alpha' },
      ],
      'mm-1': [
        { id: '1', name: 'Gina Permata', status: 'present', time: '07:14' },
        { id: '2', name: 'Haris Kusuma', status: 'present', time: '07:17' },
      ],
      'mm-2': [
        { id: '1', name: 'Ida Kusuma', status: 'present', time: '07:20' },
      ],
      'tl-1': [
        { id: '1', name: 'Joko Wijaya', status: 'present', time: '07:13' },
        { id: '2', name: 'Karina Putri', status: 'alpha' },
      ],
    }
    return attendanceByClass[classId] || []
  }

  const getActualStatus = (recordId: string) => {
    return statusChanges[recordId] !== undefined ? statusChanges[recordId] : null
  }

  const handleStatusChange = (recordId: string, newStatus: string) => {
    setStatusChanges(prev => ({
      ...prev,
      [recordId]: newStatus
    }))
  }

  const attendanceData = selectedClass ? getAttendanceData(selectedClass, dateFilter) : []
  const currentClasses = selectedJurusan ? classMap[selectedJurusan] || [] : []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'alpha':
        return 'bg-red-100 text-red-800'
      case 'izin':
        return 'bg-blue-100 text-blue-800'
      case 'sakit':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Hadir'
      case 'late':
        return 'Terlambat'
      case 'alpha':
        return 'Alpha'
      case 'izin':
        return 'Izin'
      case 'sakit':
        return 'Sakit'
      default:
        return status
    }
  }

  const stats = {
    present: attendanceData.filter(r => (getActualStatus(`${selectedClass}-${r.id}`) || r.status) === 'present').length,
    alpha: attendanceData.filter(r => (getActualStatus(`${selectedClass}-${r.id}`) || r.status) === 'alpha').length,
    late: attendanceData.filter(r => (getActualStatus(`${selectedClass}-${r.id}`) || r.status) === 'late').length,
    izin: attendanceData.filter(r => (getActualStatus(`${selectedClass}-${r.id}`) || r.status) === 'izin').length,
    sakit: attendanceData.filter(r => (getActualStatus(`${selectedClass}-${r.id}`) || r.status) === 'sakit').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Kehadiran Siswa</h1>
          <p className="text-slate-600">Pantau dan kelola kehadiran siswa per kelas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" disabled={!selectedClass}>
          <Download className="h-4 w-4 mr-2" />
          Export Laporan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pilih Tingkat Kelas</CardTitle>
          <CardDescription>Pilih tingkat (10, 11, 12) terlebih dahulu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {tingkatList.map((tingkat) => (
              <button
                key={tingkat}
                onClick={() => {
                  setSelectedTingkat(tingkat)
                  setSelectedJurusan('')
                  setSelectedClass('')
                }}
                className={`p-3 rounded-lg border-2 transition-all text-center font-semibold ${
                  selectedTingkat === tingkat
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                Kelas {tingkat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTingkat && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pilih Jurusan</CardTitle>
            <CardDescription>Pilih jurusan untuk melihat daftar kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jurusanList.map((jurusan) => (
                <button
                  key={jurusan.id}
                  onClick={() => {
                    setSelectedJurusan(jurusan.id)
                    setSelectedClass('')
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left font-medium ${
                    selectedJurusan === jurusan.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {jurusan.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedJurusan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pilih Kelas</CardTitle>
            <CardDescription>Pilih kelas untuk melihat data kehadiran siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentClasses.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem.id)}
                  className={`p-3 rounded-lg border-2 transition-all font-medium ${
                    selectedClass === classItem.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {classItem.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClass && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Pilih Tanggal</label>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Terapkan Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Hadir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Alpha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.alpha}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Terlambat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Izin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.izin}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sakit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.sakit}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Kehadiran {selectedClass.toUpperCase()}</CardTitle>
              <CardDescription>
                Tanggal: {new Date(dateFilter).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • Total Siswa: {attendanceData.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Tidak ada data kehadiran
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold">No</th>
                        <th className="text-left py-3 px-4 font-semibold">Nama Siswa</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Jam Masuk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, index) => {
                        const recordKey = `${selectedClass}-${record.id}`
                        const currentStatus = getActualStatus(recordKey) || record.status
                        const isEditable = record.status === 'alpha'

                        return (
                          <tr
                            key={index}
                            className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-slate-700">{index + 1}</td>
                            <td className="py-3 px-4 font-medium">{record.name}</td>
                            <td className="py-3 px-4 text-center">
                              {isEditable ? (
                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleStatusChange(recordKey, e.target.value)}
                                  className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${getStatusBadge(currentStatus)}`}
                                >
                                  <option value="alpha">Alpha</option>
                                  <option value="izin">Izin</option>
                                  <option value="sakit">Sakit</option>
                                </select>
                              ) : (
                                <span className={`inline-block text-sm font-medium px-3 py-1 rounded ${getStatusBadge(currentStatus)}`}>
                                  {getStatusLabel(currentStatus)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center text-slate-600">
                              {record.time || '-'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!selectedClass && (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <ChevronDown className="h-12 w-12 mx-auto text-slate-300" />
              <p className="text-slate-600 font-medium">
                {selectedTingkat ? (selectedJurusan ? 'Pilih kelas untuk melihat data kehadiran' : 'Pilih jurusan terlebih dahulu') : 'Pilih tingkat kelas terlebih dahulu'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
