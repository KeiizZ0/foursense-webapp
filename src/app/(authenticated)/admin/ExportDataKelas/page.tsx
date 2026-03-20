'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  Download, Filter, ChevronDown, Calendar, Users,
  CheckCircle, XCircle, AlertCircle, Clock, BookOpen 
} from 'lucide-react'

import { getAllStudents } from '@/restApi/student.api'
import type { StudentListResponse, StudentSummary } from '@/type/user.type'
import { useTransition } from 'react'

export default function ExportDataKelas() {
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedJurusan, setSelectedJurusan] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])
  const [studentData, setStudentData] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // ============== DUMMY DATA ==============
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

  const dummySiswa = [
    { id: '1', nis: '2024001', name: 'Ahmad Fauzi', kelas_id: 'rpl-1', email: 'ahmad.fauzi@example.com', pasword: 'password123' },
    { id: '2', nis: '2024002', name: 'Budi Santoso', kelas_id: 'rpl-1', email: 'budi.santosa@example.com', pasword: 'password123' },
    { id: '3', nis: '2024003', name: 'Citra Dewi', kelas_id: 'rpl-1', email: 'citra.dewi@example.com', pasword: 'password123' },
    { id: '4', nis: '2024004', name: 'Dian Pratama', kelas_id: 'rpl-1', email: 'dian.pratama@example.com', pasword: 'password123' },
    { id: '5', nis: '2024005', name: 'Eka Putri', kelas_id: 'rpl-1', email: 'eka.putri@example.com', pasword: 'password123' },
  ]



  // Panggil ketika kelas dipilih
const handleSelectClass = (classId: string) => {
  setSelectedClass(classId)
}

  // Fetch real student data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      
      setLoading(true);
      try {
        const [major, classNumberStr] = selectedClass.split('-');
        const classNumber = parseInt(classNumberStr);
        const tingkatNum = parseInt(selectedTingkat, 10)
        const currentYear = new Date().getFullYear()
        const entryYear = currentYear - (tingkatNum - 9)
        const academicYear = `${entryYear}/${entryYear + 1}`
        
        const response = await getAllStudents({
          academicYear,
          major,
          classNumber,
        });
        
        setStudentData(response.data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
        alert('Gagal memuat data siswa');
        setStudentData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [selectedClass, selectedTingkat]);

    const handleExportReport = async () => {
      if (!studentData.length) {
        alert('Pilih kelas terlebih dahulu!')
        return
      }

  setIsExporting(true)
  
  try {
    // Prepare data for Excel
    const exportData = studentData.map((student, index) => ({
      'No': index + 1,
      'NIS': student.nis,
      'Nama Siswa': student.user.name,
      'Kelas': kelasList.find(k => k.id === selectedClass)?.name || '',
      'Email': student.user.email
    }))

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // Auto-size columns
    const colWidths = [
      {wch: 6},  // No
      {wch: 12}, // NIS
      {wch: 25}, // Nama
      {wch: 15}, // Kelas
      {wch: 30}, // Email
    ]
    ws['!cols'] = colWidths

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Kelas')

    // Generate filename
    const className = kelasList.find(k => k.id === selectedClass)?.name || 'kelas'
    const filename = `Laporan_${className}_${new Date().toISOString().slice(0,10)}.xlsx`

    // Download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    saveAs(blob, filename)

    alert(`✅ Laporan ${className} berhasil di-export!`)
  } catch (error) {
    console.error('Export failed:', error)
    alert('❌ Gagal export laporan!')
  } finally {
    setIsExporting(false)
  }
}





  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Export Data Kelas
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Lihat data siswa per kelas dan export laporan ke Excel
          </p>
        </div>
        
        <button
          onClick={handleExportReport}
          disabled={!selectedClass || isExporting}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium gap-2
            ${!selectedClass || isExporting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Laporan
            </>
          )}
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
                setStudentData([])
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
                  setStudentData([])
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

      {/* DATA SISWA */}
      {selectedClass && (
        <>
          
          {/* TABLE */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Siswa {kelasList.find(k => k.id === selectedClass)?.name}
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading data...</p>
              </div>
            ) : studentData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada data siswa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentData.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono">{student.nis}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{student.user.name}</td>
                        <td className="px-4 py-3 text-sm text-center font-medium">{kelasList.find(k => k.id === selectedClass)?.name}</td>
                        <td className="px-4 py-3 text-sm text-center">{student.user.email}</td>
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
            <p className="text-gray-700 font-medium mb-2">
              {!selectedTingkat && 'Pilih tingkat kelas terlebih dahulu'}
              {selectedTingkat && !selectedJurusan && 'Pilih jurusan terlebih dahulu'}
              {selectedTingkat && selectedJurusan && 'Pilih kelas untuk melihat data siswa'}
            </p>
            <p className="text-gray-500 text-sm">Export laporan Excel tersedia setelah memilih kelas</p>
          </div>
        </div>
      )}
    </div>
  )
}

