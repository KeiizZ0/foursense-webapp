'use client'

import { useState, useEffect } from 'react'
import {
  Download, Filter, ChevronDown, Calendar, Users,
  CheckCircle, XCircle, AlertCircle, Clock, BookOpen, X
} from 'lucide-react'
import { getClassAbsences } from '@/restApi/absence.api'
import type { Absence } from '@/type/absence.type'
import * as XLSX from 'xlsx'

export default function TeacherAbsencePage() {
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])
  const [absenceData, setAbsenceData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // State untuk Modal Export
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportStartDate, setExportStartDate] = useState(new Date().toISOString().split('T')[0])
  const [exportEndDate, setExportEndDate] = useState(new Date().toISOString().split('T')[0])
  const [exportLoading, setExportLoading] = useState(false)

  const jurusanList = [
    { id: '1', name: 'RPL (Rekayasa Perangkat Lunak)', code: 'rpl' },
    { id: '2', name: 'DKV (Desain Komunikasi Visual)', code: 'dkv' },
    { id: '3', name: 'TOI (Teknik Otomasi Industri)', code: 'toi' },
    { id: '4', name: 'TITL (Teknik Instalasi Tenaga Listrik)', code: 'titl' },
    { id: '5', name: 'TAV (Teknik Audio Video)', code: 'tav' },
    { id: '6', name: 'TKJ (Teknik Komputer dan Jaringan)', code: 'tkj' },
  ]

  const kelasList = selectedJurusan ? [
    { id: `${selectedJurusan}-1`, name: `${selectedJurusan.toUpperCase()} 1`, tingkat: selectedTingkat, jurusan_code: selectedJurusan },
    { id: `${selectedJurusan}-2`, name: `${selectedJurusan.toUpperCase()} 2`, tingkat: selectedTingkat, jurusan_code: selectedJurusan },
    { id: `${selectedJurusan}-3`, name: `${selectedJurusan.toUpperCase()} 3`, tingkat: selectedTingkat, jurusan_code: selectedJurusan },
  ] : []

  const mapApiStatusToLocal = (status: string): string => {
    switch (status) {
      case 'PRESENT': return 'present'
      case 'ABSENT': return 'alpha'
      case 'SICK': return 'sakit'
      case 'PERMIT': return 'izin'
      default: return 'alpha'
    }
  }

  const fetchAbsences = async () => {
    if (!selectedClass || !selectedJurusan || !dateFilter) return
    setLoading(true)
    setError('')
    try {
      const [jurusan, classNumStr] = selectedClass.split('-')
      const classNumber = parseInt(classNumStr, 10)
      const tingkatNum = parseInt(selectedTingkat, 10)
      const major = jurusan.toUpperCase()
      const currentYear = new Date().getFullYear()
      const entryYear = currentYear - (tingkatNum - 9)
      const academicYear = `${entryYear}/${entryYear + 1}`

      const startDate = new Date(dateFilter)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(dateFilter)
      endDate.setHours(23, 59, 59, 999)

      const response = await getClassAbsences({ academicYear, major, classNumber, start: startDate.toISOString(), end: endDate.toISOString() })

      if (response.success) {
        const mappedData = response.data.absences.map((absence: any) => ({
          id: absence.id,
          student_nis: absence.student.nis || '-',
          student_name: absence.student.user.name,
          status: mapApiStatusToLocal(absence.status),
          time_in: new Date(absence.absenceAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }))
        setAbsenceData(mappedData)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbsences()
  }, [selectedClass, dateFilter])

  // LOGIC EXPORT EXCEL DENGAN NOMOR OTOMATIS
  const handleExportExcel = async () => {
    setExportLoading(true)
    try {
      const [jurusan, classNumStr] = selectedClass.split('-')
      const classNumber = parseInt(classNumStr, 10)
      const major = jurusan.toUpperCase()
      const tingkatNum = parseInt(selectedTingkat, 10)
      const entryYear = new Date().getFullYear() - (tingkatNum - 9)
      const academicYear = `${entryYear}/${entryYear + 1}`

      const start = new Date(exportStartDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(exportEndDate)
      end.setHours(23, 59, 59, 999)

      const response = await getClassAbsences({ academicYear, major, classNumber, start: start.toISOString(), end: end.toISOString() })

      if (response.success) {
        const absences: Absence[] = response.data.absences
        
        const studentMap: { [key: string]: any } = {}

        absences.forEach((abs: any) => {
          const nis = abs.student.nis || '-'
          const name = abs.student.user.name
          const date = abs.absenceAt.split('T')[0]
          
          if (!studentMap[nis]) {
            studentMap[nis] = { 
              NIS: nis, 
              Nama: name 
            }
          }
          studentMap[nis][date] = mapApiStatusToLocal(abs.status).toUpperCase()
        })

        // Menambahkan penomoran otomatis
        const finalData = Object.values(studentMap).map((student, index) => ({
          No: index + 1,
          ...student
        }))

        const worksheet = XLSX.utils.json_to_sheet(finalData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi")
        XLSX.writeFile(workbook, `Absensi_${major}_${selectedTingkat}_${exportStartDate}_to_${exportEndDate}.xlsx`)
        setShowExportModal(false)
      }
    } catch (err) {
      alert("Gagal export data")
    } finally {
      setExportLoading(false)
    }
  }

  const stats = {
    present: absenceData.filter(a => a.status === 'present').length,
    late: 0,
    alpha: absenceData.filter(a => a.status === 'alpha').length,
    izin: absenceData.filter(a => a.status === 'izin').length,
    sakit: absenceData.filter(a => a.status === 'sakit').length,
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200'
      case 'alpha': return 'bg-red-100 text-red-800 border-red-200'
      case 'izin': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'sakit': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir'
      case 'alpha': return 'Alpha'
      case 'izin': return 'Izin'
      case 'sakit': return 'Sakit'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kehadiran Siswa</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Pantau dan kelola kehadiran siswa per kelas</p>
        </div>
        
        <button
          onClick={() => setShowExportModal(true)}
          disabled={!selectedClass}
          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium gap-2 ${!selectedClass ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          <Download className="w-4 h-4" />
          Export Laporan
        </button>
      </div>

      {/* MODAL EXPORT */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Export ke Excel</h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kelas Terpilih</label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                   Kelas {selectedTingkat} - {kelasList.find(k => k.id === selectedClass)?.name}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                  <input 
                    type="date" 
                    value={exportStartDate} 
                    onChange={(e) => setExportStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                  <input 
                    type="date" 
                    value={exportEndDate} 
                    onChange={(e) => setExportEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <button
                onClick={handleExportExcel}
                disabled={exportLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {exportLoading ? 'Memproses...' : 'Download Excel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PILIH TINGKAT */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Pilih Tingkat Kelas</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['10', '11', '12'].map((tingkat) => (
            <button
              key={tingkat}
              onClick={() => {
                setSelectedTingkat(tingkat); setSelectedJurusan(''); setSelectedClass(''); setAbsenceData([]);
              }}
              className={`px-4 py-3 rounded-lg font-medium ${selectedTingkat === tingkat ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'}`}
            >
              Kelas {tingkat}
            </button>
          ))}
        </div>
      </div>

      {/* PILIH JURUSAN */}
      {selectedTingkat && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Pilih Jurusan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {jurusanList.map((jurusan) => (
              <button
                key={jurusan.id}
                onClick={() => { setSelectedJurusan(jurusan.code); setSelectedClass(''); setAbsenceData([]); }}
                className={`px-4 py-3 rounded-lg font-medium text-left ${selectedJurusan === jurusan.code ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'}`}
              >
                {jurusan.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PILIH KELAS */}
      {selectedJurusan && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Pilih Kelas</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kelasList.map((kelas) => (
              <button
                key={kelas.id}
                onClick={() => setSelectedClass(kelas.id)}
                className={`px-4 py-3 rounded-lg font-medium ${selectedClass === kelas.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'}`}
              >
                {kelas.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DATA AREA */}
      {selectedClass && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Tanggal</h2>
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatCard icon={<CheckCircle className="w-6 h-6 text-green-600" />} val={stats.present} label="Hadir" color="green" />
            <StatCard icon={<Clock className="w-6 h-6 text-yellow-600" />} val={stats.late} label="Terlambat" color="yellow" />
            <StatCard icon={<XCircle className="w-6 h-6 text-red-600" />} val={stats.alpha} label="Alpha" color="red" />
            <StatCard icon={<BookOpen className="w-6 h-6 text-blue-600" />} val={stats.izin} label="Izin" color="blue" />
            <StatCard icon={<AlertCircle className="w-6 h-6 text-purple-600" />} val={stats.sakit} label="Sakit" color="purple" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Kehadiran {kelasList.find(k => k.id === selectedClass)?.name}</h2>
            {loading ? <p className="text-center py-6">Loading...</p> : absenceData.length === 0 ? (
              <div className="text-center py-12"><p className="text-gray-600">Belum ada data kehadiran</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">NIS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nama Siswa</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Jam Masuk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {absenceData.map((record, index) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono">{record.student_nis}</td>
                        <td className="px-4 py-3 text-sm font-medium">{record.student_name}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(record.status)}`}>
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">{record.time_in || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedClass && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <ChevronDown className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium">
            {!selectedTingkat ? 'Pilih tingkat kelas terlebih dahulu' : !selectedJurusan ? 'Pilih jurusan terlebih dahulu' : 'Pilih kelas untuk melihat data kehadiran'}
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, val, label, color }: any) {
  const colors: any = {
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  }
  return (
    <div className={`${colors[color]} rounded-xl p-4 border`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold">{val}</span>
      </div>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  )
}