'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Mail, Phone, Eye } from 'lucide-react'

interface Student {
  id: string
  name: string
  nisn: string
  email: string
  phone: string
  attendance: number
  tasksCompleted: number
  status: 'active' | 'inactive'
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Ahmad Wirawan',
      nisn: '0012345678',
      email: 'ahmad@school.com',
      phone: '08123456789',
      attendance: 25,
      tasksCompleted: 11,
      status: 'active',
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      nisn: '0012345679',
      email: 'siti@school.com',
      phone: '08123456790',
      attendance: 24,
      tasksCompleted: 12,
      status: 'active',
    },
    {
      id: '3',
      name: 'Budi Santoso',
      nisn: '0012345680',
      email: 'budi@school.com',
      phone: '08123456791',
      attendance: 22,
      tasksCompleted: 10,
      status: 'active',
    },
    {
      id: '4',
      name: 'Rina Wijaya',
      nisn: '0012345681',
      email: 'rina@school.com',
      phone: '08123456792',
      attendance: 23,
      tasksCompleted: 11,
      status: 'active',
    },
  ])

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.email.includes(searchTerm)
  )

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Data Siswa</h1>
        <p className="text-slate-600">Kelola dan pantau data siswa di kelas Anda</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari siswa berdasarkan nama, NISN, atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-600">
              Siswa tidak ditemukan
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{student.name}</h3>
                    <p className="text-sm text-slate-600">NISN: {student.nisn}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <a
                        href={`mailto:${student.email}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </a>
                      <a
                        href={`tel:${student.phone}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {student.phone}
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <p className="font-medium text-green-600">{student.attendance} Hadir</p>
                      <p className="text-slate-600 text-xs">{student.tasksCompleted} Tugas Selesai</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
