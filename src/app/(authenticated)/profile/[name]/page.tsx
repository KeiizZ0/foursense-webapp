'use client'

import { useUserStorage } from '@/store/user.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, BookOpen, Calendar, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StudentProfilePage() {
  const { myData, showMe } = useUserStorage()
  const router = useRouter()

  // Compute class info
  const currentYear = new Date().getFullYear()
  const studentClass = myData?.student?.class
  const academicYearEnd = studentClass?.academicYear?.split('/')[1]
  const endYear = academicYearEnd ? parseInt(academicYearEnd, 10) : 0
  const grade = endYear ? (currentYear + 10 - endYear).toString() : null
  const combinedClass = studentClass 
    ? `${grade} ${studentClass.major.toUpperCase()} ${studentClass.classNumber}`.trim() 
    : (myData?.kelas || 'N/A')
  const nisDisplay = myData?.student?.nis || myData?.nis || 'N/A'

  useEffect(() => {
    if (!myData) showMe()
  }, [myData, showMe])

  if (!myData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-900/10 rounded-2xl">
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">

        {/* Header */}
        <div className="dashboard-stat-card flex items-center gap-2 sm:gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="p-1 sm:p-2 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5" />
          </Button>
          <div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-bold">Profil Saya</h1>
            <p className="text-xs sm:text-sm text-slate-600">Informasi pribadi siswa</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="dashboard-stat-card" style={{ animationDelay: "0.1s" }}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8 px-3 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                <div className="w-12 h-12 sm:w-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 sm:h-8 md:h-10 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 break-words">{myData.name}</h2>
                  <p className="text-blue-600 font-medium text-xs sm:text-sm md:text-base">Siswa</p>
                  <p className="text-slate-600 text-xs md:text-sm mt-1">{nisDisplay}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <div className="dashboard-stat-card" style={{ animationDelay: "0.15s" }}>
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6 ">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg md:text-xl">
                <User className="h-4 w-4 sm:h-5 text-blue-600 flex-shrink-0 " />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 ">
                <div className="p-2 sm:p-3 md:p-4 bg-slate-50 rounded-lg ">
                  <p className="text-xs text-slate-600 uppercase font-semibold ">Nama Lengkap</p>
                  <p className="text-xs sm:text-sm md:text-lg font-medium mt-1 break-words">{myData.name}</p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase font-semibold">Email</p>
                  <p className="text-xs sm:text-sm md:text-lg font-medium mt-1 break-all">{myData.email}</p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase font-semibold">NIS</p>
                  <p className="text-xs sm:text-sm md:text-lg font-medium mt-1">{nisDisplay}</p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase font-semibold">Kelas</p>
                  <p className="text-xs sm:text-sm md:text-lg font-medium mt-1">{combinedClass}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="dashboard-stat-card" style={{ animationDelay: "0.2s" }}>
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg md:text-xl">
                <Phone className="h-4 w-4 sm:h-5 text-blue-600 flex-shrink-0" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6">
              <div className="p-2 sm:p-3 md:p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 uppercase font-semibold flex items-center gap-2">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  Email
                </p>
                <p className="text-xs sm:text-sm md:text-lg font-medium mt-1 break-all">{myData.email}</p>
              </div>
          
            </CardContent>
          </Card>
        </div>

      
      </div>
    </div>
  )
}
