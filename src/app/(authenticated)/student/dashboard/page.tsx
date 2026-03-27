import { getWeeklyAbsensi } from "@/restApi/dashboardSiswa.api";
import { getMyTodos } from "@/restApi/todo.api";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, BookOpen, AlertCircle, Calendar, Users } from "lucide-react";

interface AbsensiData {
  _count: { status: number };
  status: string;
}

interface TodoData {
  id: number;
  title: string;
  status: "Normal" | "Urgent";
  date?: string;
  done: boolean;
}

export default async function DashboardPage() {
  let absensiData: AbsensiData[] = [];
  let todos: TodoData[] = [];
  
  try {
    const absensiResult = await getWeeklyAbsensi();
    // Validasi dan normalisasi data absensi
    let absensiArray: AbsensiData[] = [];
    if (Array.isArray(absensiResult)) {
      absensiArray = absensiResult;
    } else if (absensiResult && typeof absensiResult === 'object') {
      // Jika response berbentuk object dengan properti data/result
      const data = (absensiResult as any).data || (absensiResult as any).result || [];
      absensiArray = Array.isArray(data) ? data : [];
    }
    absensiData = absensiArray;
  } catch (error) {
    console.error("Error fetching absensi:", error);
  }

  try {
    todos = await getMyTodos();
  } catch (error) {
    console.error("Error fetching todos:", error);
  }

  // Hitung statistik
  const totalTugas = todos.length;
  const tugasSelesai = todos.filter((t: TodoData) => t.done).length;
  const tugasAktif = totalTugas - tugasSelesai;

  // Hitung statistik absensi
  const absensiStats = {
    hadir: absensiData.find((a: AbsensiData) => a.status === "PRESENT")?._count?.status || 0,
    terlambat: absensiData.find((a: AbsensiData) => a.status === "LATE")?._count?.status || 0,
    sakit: absensiData.find((a: AbsensiData) => a.status === "SICK")?._count?.status || 0,
    izin: absensiData.find((a: AbsensiData) => a.status === "PERMISSION")?._count?.status || 0,
    alpha: absensiData.find((a: AbsensiData) => a.status === "ABSENT")?._count?.status || 0,
  };

  // Mapping 5 status yang mungkin
  const statusMap: Record<string, string> = {
    "PRESENT": "Hadir",
    "LATE": "Terlambat",
    "SICK": "Sakit",
    "PERMISSION": "Izin",
    "ABSENT": "Alpha"
  };

  const getStatusLabel = (status: string) => statusMap[status] || status;

  return (
    <div className="min-h-screen overflow-x-hidden bg-blue-900/10 p-4 md:p-6 lg:p-8 rounded-2xl">
      {/* HEADER */}
      <div className="dashboard-stat-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Siswa</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Selamat datang! Kelola kehadiran dan todo list Anda di sini.
          </p>
        </div>
      </div>

      {/* CARD STATISTIK ABSENSI - SEPERTI TEACHER PAGE */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {/* Hadir */}
        <div className="dashboard-stat-card">
          <StatCard 
            icon={<CheckCircle className="w-6 h-6 text-green-600" />} 
            val={absensiStats.hadir} 
            label="Hadir" 
            color="green" 
          />
        </div>

        {/* Terlambat */}
        <div className="dashboard-stat-card">
          <StatCard 
            icon={<Clock className="w-6 h-6 text-yellow-600" />} 
            val={absensiStats.terlambat} 
            label="Terlambat" 
            color="yellow" 
          />
        </div>

        {/* Sakit */}
        <div className="dashboard-stat-card">
          <StatCard 
            icon={<AlertCircle className="w-6 h-6 text-purple-600" />} 
            val={absensiStats.sakit} 
            label="Sakit" 
            color="purple" 
          />
        </div>

        {/* Izin */}
        <div className="dashboard-stat-card">
          <StatCard 
            icon={<BookOpen className="w-6 h-6 text-blue-600" />} 
            val={absensiStats.izin} 
            label="Izin" 
            color="blue" 
          />
        </div>

        {/* Alpha */}
        <div className="dashboard-stat-card">
          <StatCard 
            icon={<XCircle className="w-6 h-6 text-red-600" />} 
            val={absensiStats.alpha} 
            label="Alpha" 
            color="red" 
          />
        </div>
      </div>

      {/* AKSI CEPAT */}
      <div className="dashboard-stat-card bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 hover:shadow-md transition-all duration-300">
        <h2 className="font-semibold text-gray-800">Aksi Cepat</h2>
        <p className="text-gray-400 text-sm mb-4">
          Mulai dari sini untuk menyelesaikan requirements
        </p>

        <div className="flex gap-3">
          <Link 
            href="/student/absence" 
            className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out hover:text-white hover:scale-105"
          >
            Lihat Todo List
          </Link>

          <Link 
            href="/student/absence?tab=absence" 
            className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out hover:text-white hover:scale-105"
          >
            Absensi 
          </Link>
        </div>
      </div>

      {/* TODO LIST */}
      <div className="dashboard-stat-card bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Todo List Anda</h2>
          <div className="text-sm text-gray-500">
            {tugasSelesai} / {totalTugas} selesai
          </div>
        </div>

        {todos.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Belum ada tugas</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {todos.slice(0, 6).map((todo: TodoData) => (
              <div
                key={todo.id}
                className={`border rounded-lg p-3 flex justify-between items-center transition-all duration-200 hover:shadow-sm border-red-400 ${
                todo.done ? "bg-gray-50" : ""
                }`}
              >
                <div>
                  <p className={`font-semibold capitalize ${todo.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {todo.title}
                  </p>
                  {todo.date && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {todo.date}
                    </p>
                  )}
                </div>

                {todo.done ? (
                  <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Selesai
                  </span>
                ) : (
                  <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {todos.length > 6 && (
          <div className="mt-4 text-center">
            <Link href="/student/todo" className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all">
              Lihat semua {todos.length} tugas →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, val, label, color }: { icon: React.ReactNode; val: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };
  
  return (
    <div className={`${colors[color]} rounded-xl p-4 border transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold">{val}</span>
      </div>
      <p className="text-sm font-medium opacity-80">{label}</p>
    </div>
  );
}