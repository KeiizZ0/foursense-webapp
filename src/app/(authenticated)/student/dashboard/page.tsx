import { getWeeklyAbsensi } from "@/restApi/dashboardSiswa.api";
import { getMyTodos } from "@/restApi/todo.api";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-1">Dashboard Siswa</h1>
      <p className="text-gray-500 mb-6">
        Selamat datang! Kelola kehadiran dan todo list Anda di sini.
      </p>

      {/* CARD STATISTIK ABSENSI - 2 KOLOM DI MOBILE, 5 KOLOM DI DESKTOP */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4 mb-6">
        {/* Hadir */}
        <div className="dashboard-stat-card bg-white rounded-xl shadow p-3 lg:p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm lg:text-base">Hadir</h2>
            <span className="text-green-500 text-lg">●</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{absensiStats.hadir}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>

        {/* Terlambat */}
        <div className="dashboard-stat-card bg-white rounded-xl shadow p-3 lg:p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm lg:text-base">Terlambat</h2>
            <span className="text-yellow-500 text-lg">●</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{absensiStats.terlambat}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>

        {/* Sakit */}
        <div className="dashboard-stat-card bg-white rounded-xl shadow p-3 lg:p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm lg:text-base">Sakit</h2>
            <span className="text-blue-500 text-lg">●</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{absensiStats.sakit}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>

        {/* Izin */}
        <div className="dashboard-stat-card bg-white rounded-xl shadow p-3 lg:p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm lg:text-base">Izin</h2>
            <span className="text-purple-500 text-lg">●</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{absensiStats.izin}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>

        {/* Alpha */}
        <div className="dashboard-stat-card bg-white rounded-xl shadow p-3 lg:p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm lg:text-base">Alpha</h2>
            <span className="text-red-500 text-lg">●</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{absensiStats.alpha}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>

      {/* AKSI CEPAT */}
      <div className="dashboard-stat-card bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="font-semibold">Aksi Cepat</h2>
        <p className="text-gray-400 text-sm mb-4">
          Mulai dari sini untuk menyelesaikan requirements
        </p>

        <div className="flex gap-3">
          <Link href="/student/absence" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Lihat Todo List
          </Link>

          <div className="flex gap-3">
          <Link href="/student/absence?tab=absence" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Absensi 
          </Link>
          
        </div>
        </div>
      </div>

      {/* TODO LIST */}
      <div className="dashboard-stat-card bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Todo List Anda</h2>
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
                className={`border rounded-lg p-3 flex justify-between items-center ${
                  todo.done ? "bg-gray-50" : ""
                }`}
              >
                <div>
                  <p className={`font-semibold capitalize ${todo.done ? "line-through text-gray-400" : ""}`}>
                    {todo.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {todo.date}
                  </p>
                </div>

                {todo.done ? (
                  <span className="text-green-500 text-sm">Selesai</span>
                ) : (
                  <span className="text-red-500 text-sm">Pending</span>
                )}
              </div>
            ))}
          </div>
        )}

        {todos.length > 6 && (
          <div className="mt-4 text-center">
            <Link href="/student/todo" className="text-blue-600 hover:underline text-sm">
              Lihat semua {todos.length} tugas →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}