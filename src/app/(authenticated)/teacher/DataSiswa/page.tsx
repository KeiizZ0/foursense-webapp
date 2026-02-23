"use client";

import { Search, Mail, Phone, Eye } from "lucide-react";

const dataSiswa = [
  {
    nama: "Ahmad Wirawan",
    nisn: "0012345678",
    email: "ahmad@school.com",
    telp: "08123456789",
    hadir: 25,
    tugas: 11,
  },
  {
    nama: "Siti Nurhaliza",
    nisn: "0012345679",
    email: "siti@school.com",
    telp: "08123456790",
    hadir: 24,
    tugas: 12,
  },
  {
    nama: "Budi Santoso",
    nisn: "0012345680",
    email: "budi@school.com",
    telp: "08123456791",
    hadir: 22,
    tugas: 10,
  },
  {
    nama: "Rina Wijaya",
    nisn: "0012345681",
    email: "rina@school.com",
    telp: "08123456792",
    hadir: 23,
    tugas: 11,
  },
];

export default function DataSiswa() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="mb-6 flex flex-col items-start">
        <h1 className="text-2xl font-bold">Data Siswa</h1>
        <p className="text-gray-500">
          Kelola dan pantau data siswa di kelas Anda
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center border rounded-lg bg-white px-3 py-2">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, atau email..."
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* List Siswa */}
      <div className="space-y-4">
        {dataSiswa.map((siswa, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            {/* Kiri */}
            <div>
              <h2 className="font-semibold text-lg">{siswa.nama}</h2>
              <p className="text-sm text-gray-500">NISN: {siswa.nisn}</p>

              <div className="flex gap-4 mt-2 text-blue-600 text-sm">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  {siswa.email}
                </div>

                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  {siswa.telp}
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-green-600 font-semibold">
                  {siswa.hadir} Hadir
                </p>
                <p className="text-sm text-gray-500">
                  {siswa.tugas} Tugas
                </p>
              </div>

              <button className="border rounded-lg p-2 hover:bg-gray-100">
                <Eye />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
