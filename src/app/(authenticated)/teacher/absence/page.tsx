'use client'

import { useState } from 'react'
import { 
  Download, Filter, ChevronDown, Calendar, Users,
  CheckCircle, XCircle, AlertCircle, Clock, BookOpen 
} from 'lucide-react'

export default function TeacherAbsencePage() {
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])
  const [absenceData, setAbsenceData] = useState<any[]>([])

  // ============== DUMMY DATA ==============
  const jurusanList = [
    { id: '1', name: 'RPL (Rekayasa Perangkat Lunak)', code: 'rpl' },
    { id: '2', name: 'TBSM (Teknik & Bisnis Sepeda Motor)', code: 'tbsm' },
    { id: '3', name: 'DPB (Desain Pemodelan & Informasi Bangunan)', code: 'dpb' },
    { id: '4', name: 'TK (Teknik Komputer & Jaringan)', code: 'tk' },
    { id: '5', name: 'MM (Multimedia)', code: 'mm' },
    { id: '6', name: 'TL (Teknik Logistik)', code: 'tl' },
  ]

  const kelasList = selectedJurusan ? [
    { id: `${selectedJurusan}-1`, name: `${selectedJurusan.toUpperCase()} 1`, tingkat: selectedTingkat, jurusan_code: selectedJurusan },
    { id: `${selectedJurusan}-2`, name: `${selectedJurusan.toUpperCase()} 2`, tingkat: selectedTingkat, jurusan_code: selectedJurusan },
    { id: `${selectedJurusan}-3`, name: `${selectedJurusan.toUpperCase()} 3`, tingkat: selectedTingkat, jurusan_code: selectedJurusan },
  ] : []

  const dummySiswa = [
    { id: '1', nis: '2024001', name: 'Ahmad Fauzi', kelas_id: 'rpl-1' },
    { id: '2', nis: '2024002', name: 'Budi Santoso', kelas_id: 'rpl-1' },
    { id: '3', nis: '2024003', name: 'Citra Dewi', kelas_id: 'rpl-1' },
    { id: '4', nis: '2024004', name: 'Dian Pratama', kelas_id: 'rpl-1' },
    { id: '5', nis: '2024005', name: 'Eka Putri', kelas_id: 'rpl-1' },
  ]

// Load data dummy ketika kelas dipilih
const loadDummyData = () => {
  const dummyAbsence = dummySiswa.map((siswa, index) => {
    // Generate jam random antara 06:30 - 07:30
    const hour = Math.floor(Math.random() * 2) + 6; // 6 atau 7
    const minute = Math.floor(Math.random() * 60);
    const time_in = `${hour}:${minute.toString().padStart(2, '0')}`;
    
    // Tentukan status berdasarkan jam
    let status;
    if (hour < 7 || (hour === 7 && minute === 0)) {
      status = 'present'; // Hadir (<= 07:00)
    } else {
      status = 'late'; // Terlambat (> 07:00)
    }
    
    // Random untuk status alpha/izin/sakit (20% kemungkinan)
    if (Math.random() < 0.2) {
      const nonHadirStatus = ['alpha', 'izin', 'sakit'];
      status = nonHadirStatus[Math.floor(Math.random() * 3)] as any;
      return {
        id: `${index + 1}`,
        student_id: siswa.id,
        student_nis: siswa.nis,
        student_name: siswa.name,
        status: status,
        time_in: null // Tidak ada jam untuk alpha/izin/sakit
      };
    }

    
    
    return {
      id: `${index + 1}`,
      student_id: siswa.id,
      student_nis: siswa.nis,
      student_name: siswa.name,
      status: status,
      time_in: time_in
    };
  });
  setAbsenceData(dummyAbsence);
}

// Panggil ketika kelas dipilih
const handleSelectClass = (classId: string) => {
  setSelectedClass(classId)
  loadDummyData()
}

const handleStatusChange = (studentId: string, newStatus: string) => {
  setAbsenceData(prev => 
    prev.map(item => 
      item.student_id === studentId 
        ? { ...item, status: newStatus, time_in: newStatus === 'present' || newStatus === 'late' ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : null }
        : item
    )
  )
}

  const handleExportReport = () => {
    alert('✅ Export laporan berhasil (Demo)')
  }

  // ============== STATISTICS ==============
  const stats = {
    present: absenceData.filter(a => a.status === 'present').length,
    late: absenceData.filter(a => a.status === 'late').length,
    alpha: absenceData.filter(a => a.status === 'alpha').length,
    izin: absenceData.filter(a => a.status === 'izin').length,
    sakit: absenceData.filter(a => a.status === 'sakit').length,
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200'
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'alpha': return 'bg-red-100 text-red-800 border-red-200'
      case 'izin': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'sakit': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir'
      case 'late': return 'Terlambat'
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Kehadiran Siswa
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Pantau dan kelola kehadiran siswa per kelas
          </p>
        </div>
        
        <button
          onClick={handleExportReport}
          disabled={!selectedClass}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium gap-2
            ${!selectedClass
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          <Download className="w-4 h-4" />
          Export Laporan
        </button>
      </div>

      {/* TINGKAT */}
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
                setSelectedTingkat(tingkat)
                setSelectedJurusan('')
                setSelectedClass('')
                setAbsenceData([])
              }}
              className={`
                px-4 py-3 rounded-lg font-medium
                ${selectedTingkat === tingkat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                }
              `}
            >
              Kelas {tingkat}
            </button>
          ))}
        </div>
      </div>

      {/* JURUSAN */}
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
                onClick={() => {
                  setSelectedJurusan(jurusan.code)
                  setSelectedClass('')
                  setAbsenceData([])
                }}
                className={`
                  px-4 py-3 rounded-lg font-medium text-left
                  ${selectedJurusan === jurusan.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                  }
                `}
              >
                {jurusan.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* KELAS */}
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
                onClick={() => handleSelectClass(kelas.id)}
                className={`
                  px-4 py-3 rounded-lg font-medium
                  ${selectedClass === kelas.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                  }
                `}
              >
                {kelas.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DATA KEHADIRAN */}
      {selectedClass && (
        <>
          {/* FILTER TANGGAL */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Tanggal</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* STATISTIK */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.present}</span>
              </div>
              <p className="text-sm font-medium text-green-800">Hadir</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{stats.late}</span>
              </div>
              <p className="text-sm font-medium text-yellow-800">Terlambat</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{stats.alpha}</span>
              </div>
              <p className="text-sm font-medium text-red-800">Alpha</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{stats.izin}</span>
              </div>
              <p className="text-sm font-medium text-blue-800">Izin</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{stats.sakit}</span>
              </div>
              <p className="text-sm font-medium text-purple-800">Sakit</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Kehadiran {kelasList.find(k => k.id === selectedClass)?.name}
            </h2>
            
            {absenceData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Belum ada data kehadiran</p>
              </div>
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
                            {record.status === 'present' && <CheckCircle className="w-3 h-3" />}
                            {record.status === 'late' && <Clock className="w-3 h-3" />}
                            {record.status === 'alpha' && <XCircle className="w-3 h-3" />}
                            {record.status === 'izin' && <BookOpen className="w-3 h-3" />}
                            {record.status === 'sakit' && <AlertCircle className="w-3 h-3" />}
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">{record.time_in || '-'}</td>
                        {/* <td className="px-4 py-3 text-sm text-center">
                          <select
                            value={record.status}
                            onChange={(e) => handleStatusChange(record.student_id, e.target.value)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusStyle(record.status)}`}
                          >
                            <option value="present">Hadir</option>
                            <option value="late">Terlambat</option>
                            <option value="alpha">Alpha</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                          </select>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!selectedClass && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
          <div className="text-center">
            <ChevronDown className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-700 font-medium">
              {!selectedTingkat && 'Pilih tingkat kelas terlebih dahulu'}
              {selectedTingkat && !selectedJurusan && 'Pilih jurusan terlebih dahulu'}
              {selectedTingkat && selectedJurusan && 'Pilih kelas untuk melihat data kehadiran'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}