"use client";

import { Card } from "@/components/ui/card";
import { useStudentStorage } from "@/store/student.store";
import { useUserStorage } from "@/store/user.store";
import { useEffect } from "react";

export default function Dashboard() {
  const { myData } = useUserStorage();
  const { FetchOneStudent, getOne } = useStudentStorage();
  useEffect(() => {
    if (myData?.student && !FetchOneStudent) {
      getOne(myData?.student.id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-1">Dashboard Siswa</h1>
      <p className="text-gray-500 mb-6">
        Selamat datang! Kelola kehadiran dan todo list Anda di sini.
      </p>

      {/* CARD STATISTIK */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Total Hadir */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <h2 className="font-semibold">Total Hadir</h2>
            <span className="text-green-500">●</span>
          </div>
          {/* <p className="text-3xl font-bold mt-2">{totalHadir}</p> */}
          <p className="text-sm text-gray-400">dari 25 hari</p>
        </div>

        {/* Tugas Aktif */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <h2 className="font-semibold">Tugas Aktif</h2>
            <span className="text-blue-500">●</span>
          </div>
          {/* <p className="text-3xl font-bold mt-2">{tugasAktif}</p> */}
          <p className="text-sm text-gray-400">menunggu diselesaikan</p>
        </div>

        {/* Tugas Terlewat */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <h2 className="font-semibold">Tugas Terlewat</h2>
            <span className="text-red-500">●</span>
          </div>
          {/* <p className="text-3xl font-bold mt-2">{tugasTerlambat}</p> */}
          <p className="text-sm text-gray-400">segera selesaikan</p>
        </div>
      </div>

      {/* AKSI CEPAT */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold">Aksi Cepat</h2>
        <p className="text-gray-400 text-sm mb-4">
          Mulai dari sini untuk menyelesaikan requirements
        </p>

        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Lihat Todo List
          </button>

          <button className="border px-4 py-2 rounded-lg">
            Absensi Hari Ini
          </button>

          <button className="border px-4 py-2 rounded-lg">
            Riwayat Kehadiran
          </button>
        </div>
      </div>

      {/* CONTOH LIST DATA DARI DUMMY */}
      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Data Siswa (Contoh)</h2>

        {/* <div className="grid md:grid-cols-2 gap-3">
          {dummyDashboard.map((a) => (
            <div
              key={a.id}
              className="border rounded-lg p-3 flex justify-between gap-2.5"
            >
              <div>
                <p className="font-semibold capitalize">{a.nama}</p>
                <p className="text-sm text-gray-500">{a.status}</p>
              </div>

              {a.has_todo ? (
                <span className="text-red-500 text-sm">Punya tugas</span>
              ) : (
                <span className="text-green-500 text-sm">Aman</span>
              )}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
