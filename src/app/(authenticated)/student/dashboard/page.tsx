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

      <div className="flex flex-row max-sm:flex-wrap gap-4 mb-6">
        <Card
          title="Total Hadir"
          description="dari 7 hari"
          color="green"
          content={
            FetchOneStudent?.absences
              ? FetchOneStudent?.absences?.filter((a) => a.status === "present")
                  ?.length
              : undefined
          }
        />

        <Card
          title="Total Sakit"
          description="dari 7 hari"
          color="purple"
          content={
            FetchOneStudent?.absences
              ? FetchOneStudent?.absences?.filter((a) => a.status === "ill")
                  ?.length
              : undefined
          }
        />

        <Card
          title="Total Izin"
          description="dari 7 hari"
          color="blue"
          content={
            FetchOneStudent?.absences
              ? FetchOneStudent?.absences?.filter((a) => a.status === "onLeave")
                  ?.length
              : undefined
          }
        />

        <Card
          title="Total Terlambat"
          description="dari 7 hari"
          color="yellow"
          content={
            FetchOneStudent?.absences
              ? FetchOneStudent?.absences?.filter((a) => a.status === "late")
                  ?.length
              : undefined
          }
        />

        <Card
          title="Total Alpha"
          description="dari 7 hari"
          color="red"
          content={
            FetchOneStudent?.absences
              ? FetchOneStudent?.absences?.filter(
                  (a) => a.status === "unexcused",
                )?.length
              : undefined
          }
        />
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
      <div className="mt-6 bg-white rounded-xl shadow p-4 w-full">
        <h2 className="font-semibold mb-3">Data Siswa (Contoh)</h2>

        <div className="grid md:grid-cols-2 gap-3">
          {/* {dummyDashboard.map((a) => (
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
          ))} */}
        </div>
      </div>
    </div>
  );
}
