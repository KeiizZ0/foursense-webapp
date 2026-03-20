'use client'

import { useState, useEffect } from 'react'
import { InputFloatingLabel } from '@/components/ui/input'
import { ApiClient } from '@/lib/helpers/axios'

interface Kelas {
  id: string
  academicYear: string
  major: string
  classNumber: number
  nama_kelas?: string
}

export default function DaftarAkunPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nis: '',
    slug: '',
    kelas_id: '',
    password: '',
  })
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

useEffect(() => {
  fetchKelas()
}, [])

const fetchKelas = async () => {
  try {
    const response = await ApiClient.get('/api/class/get-all?page=1&limit=100');
    const result = response.data; // <- axios wraps the response in a 'data' property
    if (result.success && result.data?.classes) {
      setKelasList(result.data.classes.map((kelas: Kelas) => ({
        ...kelas,
        nama_kelas: `${kelas.major} ${kelas.classNumber}`
      })));
    }
  } catch (error) {
    console.error('Failed to fetch kelas:', error);
  }
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await ApiClient.post('/api/auth/register/student', [{
        name: formData.nama,
        email: formData.email,
        password: formData.password,
        slug: formData.slug,
        classId: formData.kelas_id,
        nis: formData.nis,
      }])

      const result = response.data;

      if (result.success) {
        setMessage({ type: 'success', text: 'Akun siswa berhasil ditambahkan!' })
        setFormData({ nama: '', email: '', nis: '', slug: '', kelas_id: '', password: '' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menambahkan akun' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === 'nama') {
      newFormData.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Auto-generate password from nama + nis
    const { nama, nis, kelas_id } = newFormData;
    if (nama && nis) {
      newFormData.password = `${nama.toLowerCase().replace(/\s+/g, '')}${nis}`;
    }

    // Auto-generate email from nama + kelas
    if (nama && kelas_id) {
        const selectedKelas = kelasList.find(k => k.id === kelas_id);
        if (selectedKelas && selectedKelas.nama_kelas) {
            const kelasNama = selectedKelas.nama_kelas.toLowerCase().replace(/\s+/g, '');
            const namaForEmail = nama.toLowerCase().replace(/\s+/g, '');
            newFormData.email = `${namaForEmail}.${kelasNama}@gmail.com`;
        }
    }
    
    setFormData(newFormData);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Daftar Form</h1>
        <p className="text-sm text-slate-500 mt-1">Untuk Menambahkan Data</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div className="space-y-2">
            <label htmlFor="nama" className="block text-sm font-medium text-slate-700">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-0 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          

          {/* NIS */}
          <div className="space-y-2">
            <label htmlFor="nis" className="block text-sm font-medium text-slate-700">
              NIS
            </label>
          <input
              type="text"
              id="nis"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              placeholder="NIS"
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-0 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Slug (unique identifier)"
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-0 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          {/* Kelas */}
          <div className="space-y-2">
            <label htmlFor="kelas_id" className="block text-sm font-medium text-slate-700">
              Kelas
            </label>
            <select
              id="kelas_id"
              name="kelas_id"
              value={formData.kelas_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-0 text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="" disabled>Atur Kelas</option>
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          {/* Gmail */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Gmail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Gmail Aktif"
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-0 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>
          {/* Password */}
          <div className="space-y-2">
<label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
              <InputFloatingLabel
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-3 rounded-lg bg-slate-100 border-0 text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Tambah Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
