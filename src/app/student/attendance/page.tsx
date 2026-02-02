'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Calendar, Clock, MapPin, Loader } from 'lucide-react'

interface AttendanceRecord {
  date: string
  status: 'present' | 'absent' | 'late' | 'permit'
  time?: string
  note?: string
  latitude?: number
  longitude?: number
}

export default function StudentAttendancePage() {
  const [todos, setTodos] = useState<any[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { date: '2025-11-18', status: 'present', time: '07:15' },
    { date: '2025-11-17', status: 'present', time: '07:20' },
    { date: '2025-11-16', status: 'late', time: '07:45', note: 'Macet di jalan' },
    { date: '2025-11-15', status: 'present', time: '07:10' },
    { date: '2025-11-14', status: 'absent', note: 'Sakit' },
    { date: '2025-11-13', status: 'present', time: '07:25' },
    { date: '2025-11-12', status: 'permit', note: 'Izin ke dokter' },
  ])
  const [selectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    const storedTodos = localStorage.getItem('studentTodos')
    if (storedTodos) {
      const parsedTodos = JSON.parse(storedTodos)
      setTodos(parsedTodos)
    }

    // Check if already attended today
    const today = new Date().toISOString().split('T')[0]
    const alreadyAttended = attendanceRecords.find(r => r.date === today)
    setTodayAttendance(alreadyAttended || null)
  }, [])

  const incompleteTodos = todos.filter((t: any) => !t.completed)
  const canMarkAttendance = incompleteTodos.length === 0 && todos.length > 0

  const handleRequestLocation = async () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung di browser Anda')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        setIsLoadingLocation(false)
        handleSubmitAttendance(latitude, longitude)
      },
      (error) => {
        let errorMessage = 'Gagal mengakses lokasi'
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Izin lokasi ditolak. Silakan izinkan akses lokasi di browser settings.'
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Lokasi tidak tersedia'
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Permintaan lokasi timeout'
        }
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleSubmitAttendance = (latitude?: number, longitude?: number) => {
    if (!canMarkAttendance) return

    const newRecord: AttendanceRecord = {
      date: selectedDate,
      status: 'present',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      latitude,
      longitude,
    }

    const updatedRecords = [newRecord, ...attendanceRecords.filter(r => r.date !== selectedDate)]
    setAttendanceRecords(updatedRecords)
    localStorage.setItem('studentAttendance', JSON.stringify(updatedRecords))
    setTodayAttendance(newRecord)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' }
      case 'absent':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'text-red-600' }
      case 'late':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' }
      case 'permit':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600' }
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-800', icon: 'text-slate-600' }
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Hadir'
      case 'absent':
        return 'Absen'
      case 'late':
        return 'Terlambat'
      case 'permit':
        return 'Izin'
      default:
        return status
    }
  }

  const stats = {
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    permit: attendanceRecords.filter(r => r.status === 'permit').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Absensi</h1>
        <p className="text-slate-600">Pantau kehadiran dan kelola absensi Anda</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Absen Hari Ini</CardTitle>
          <CardDescription>{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status message for incomplete todos */}
            {!canMarkAttendance && (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Tombol Absensi Dinonaktifkan</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Selesaikan {incompleteTodos.length} tugas di Todo List sebelum melakukan absensi.
                  </p>
                </div>
              </div>
            )}

            {/* Attendance status and button */}
            {todayAttendance ? (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Sudah Absensi Hari Ini</h4>
                    <p className="text-sm text-green-700">Jam: {todayAttendance.time}</p>
                    {userLocation && (
                      <p className="text-sm text-green-700 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        Lat: {userLocation.latitude.toFixed(4)}, Long: {userLocation.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                <Button disabled className="w-full bg-green-600 text-white cursor-not-allowed">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Sudah Absensi
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Location error message */}
                {locationError && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                    <p className="text-sm text-red-700">{locationError}</p>
                  </div>
                )}

                {/* Attendance button */}
                <Button
                  onClick={handleRequestLocation}
                  disabled={!canMarkAttendance || isLoadingLocation}
                  className={`w-full text-white font-medium py-6 ${
                    !canMarkAttendance
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                      : isLoadingLocation
                      ? 'bg-blue-400 hover:bg-blue-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Mengakses Lokasi...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Absen Sekarang
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-600 text-center">
                  Browser akan meminta izin akses lokasi Anda untuk keamanan absensi
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Izin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.permit}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kehadiran</CardTitle>
          <CardDescription>30 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceRecords.map((record, index) => {
              const colors = getStatusColor(record.status)
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${colors.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`h-4 w-4 ${colors.icon}`} />
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(record.date).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {record.note && <p className="text-xs text-slate-600">{record.note}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium text-sm ${colors.text}`}>
                      {getStatusLabel(record.status)}
                    </p>
                    {record.time && <p className="text-xs text-slate-600">{record.time}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
