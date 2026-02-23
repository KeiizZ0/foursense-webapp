"use client";

import { useEffect, useState } from "react"

type Siswa = {
  id: number
  nama: string
  nis: string
  email: string
  jumlah_hadir: number
}

export default function DataSiswa() {
  const [students, setStudents] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://anya-unportended-virgilio.ngrok-free.dev")
        const data = await res.json()
        setStudents(data)
      } catch (error) {
        console.error("Gagal ambil data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {students.map((siswa) => (
        <div key={siswa.id}>
          <p>Nama: {siswa.nama}</p>
          <p>NIS: {siswa.nis}</p>
          <p>Email: {siswa.email}</p>
          <p>Jumlah Hadir: {siswa.jumlah_hadir}</p>
        </div>
      ))}
    </div>
  )
}

