"use client";

type Task = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  deadlineISO?: string;
  done?: boolean;
};

type AbsenceRecord = {
  date: string;
  status: "Hadir" | "Terlambat" | "Alpa" | "Sakit" | "Izin";
};

import { useState, useEffect } from "react";
import { createTodo, getMyTodos, markAsDone, deleteTodo, updateTodo } from "@/restApi/todo.api";
import { checkIn } from "@/restApi/absence.api";
import { useUserStorage } from "@/store/user.store";
import { ApiClient } from "@/lib/helpers/axios";
import { useSearchParams } from "next/navigation";

export default function AbsencePage() {
  const searchParams = useSearchParams();
  const { myData } = useUserStorage();
  const [activeTab, setActiveTab] = useState<"tasks" | "absence">("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [absenceHistory, setAbsenceHistory] = useState<AbsenceRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  function showToast(message: string) {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [showAbsenModal, setShowAbsenModal] = useState(false);
  const [isAbsenLoading, setIsAbsenLoading] = useState(false);
  const [absenError, setAbsenError] = useState("");

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const todayISO = new Date().toISOString().split("T")[0];
  const sudahAbsenHariIni = absenceHistory.some((a) => a.date === today);

  function getStatusAbsen(): "Hadir" | "Terlambat" | "Alpa" {
    const now = new Date();
    const totalMenit = now.getHours() * 60 + now.getMinutes();
    if (totalMenit < 7 * 60) return "Hadir";
    if (totalMenit < 10 * 60) return "Terlambat";
    return "Alpa";
  }

  function mapStatusAbsen(status: string): "Hadir" | "Terlambat" | "Alpa" | "Sakit" | "Izin" {
    if (status === "PRESENT") return "Hadir";
    if (status === "LATE") return "Terlambat";
    if (status === "SICK") return "Sakit";
    if (status === "LEAVE") return "Izin";
    return "Alpa";
  }

  const statusAbsenSekarang = getStatusAbsen();
  const sudahLewatBatas = statusAbsenSekarang === "Alpa";
  const absenDisabled = tasks.length === 0 || sudahAbsenHariIni || sudahLewatBatas;

  // Efek untuk baca parameter dari URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    const openModal = searchParams.get('openModal');
    
    if (tab === 'absence') {
      setActiveTab('absence');
      
      setTimeout(() => {
        const absenSection = document.getElementById('absen-section');
        if (absenSection) {
          absenSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      if (openModal === 'true' && !sudahAbsenHariIni && !sudahLewatBatas && tasks.length > 0) {
        setTimeout(() => {
          setShowAbsenModal(true);
        }, 500);
      }
    }
  }, [searchParams, sudahAbsenHariIni, sudahLewatBatas, tasks.length]);

  async function fetchTodos() {
    setIsLoadingTasks(true);
    try {
      const data = await getMyTodos();
      console.log("RESPONSE TODO:", data);
      setTasks(data);
    } catch (err) {
      console.error("Gagal fetch tasks:", err);
    } finally {
      setIsLoadingTasks(false);
    }
  }

  async function fetchAbsenceHistory() {
    setIsLoadingHistory(true);
    try {
      const studentId = (myData as any)?.student?.id;
      if (!studentId) return;

      const response = await ApiClient.get("/api/absen/get-all", {
        params: { student: studentId },
      });

      const all = response.data?.data?.absences || [];
      const userName = myData?.name;

      const mine = Array.isArray(all)
        ? all.filter((a: any) => a.student?.user?.name === userName)
        : [];

      const mapped: AbsenceRecord[] = mine.map((a: any) => ({
        date: new Date(a.absenceAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }),
        status: mapStatusAbsen(a.status),
      }));

      const sudahAdaHariIni = mapped.some((a) => a.date === today);
      if (sudahLewatBatas && !sudahAdaHariIni) {
        mapped.unshift({ date: today, status: "Alpa" });
      }

      setAbsenceHistory(mapped);
    } catch (err) {
      console.error("Gagal fetch history absensi:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (myData) fetchAbsenceHistory();
  }, [myData]);

  async function handleToggle(id: string) {
    try {
      await markAsDone(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTodo(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Gagal hapus tugas:", err);
    }
  }

  // ========== INI FUNGSI EDIT YANG SUDAH DIPERBAIKI ==========
  function handleOpenEdit(task: Task) {
    console.log("Task yang diedit:", task);
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    
    // Parse tanggal dari berbagai format
    let deadlineValue = "";
    
    // Cek dari deadlineISO (format ISO)
    if (task.deadlineISO && task.deadlineISO !== "") {
      deadlineValue = task.deadlineISO.split("T")[0];
    } 
    // Cek dari date (format "DD/MM/YYYY")
    else if (task.date && task.date !== "") {
      try {
        // Parse format "DD/MM/YYYY" jadi "YYYY-MM-DD"
        const parts = task.date.split('/');
        if (parts.length === 3) {
          // Asumsi: parts[0] = DD, parts[1] = MM, parts[2] = YYYY
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          deadlineValue = `${year}-${month}-${day}`;
          console.log("Hasil parse tanggal:", deadlineValue);
        }
      } catch (e) {
        console.error("Gagal parse tanggal:", e);
      }
    }
    
    setEditDeadline(deadlineValue);
    setEditError("");
    setShowEditModal(true);
  }

  // ========== INI FUNGSI SAVE EDIT YANG SUDAH DIPERBAIKI ==========
  async function handleSaveEdit() {
    if (!editTitle.trim()) { 
      setEditError("Judul tidak boleh kosong!"); 
      return; 
    }
    if (!editTask) return;
    
    setIsEditLoading(true);
    setEditError("");
    
    try {
      // Kirim deadline dalam format yang benar
      const deadlineToSend = editDeadline ? new Date(editDeadline).toISOString() : undefined;
      
      console.log("Mengirim update:", {
        id: editTask.id,
        activity: editTitle,
        description: editDescription,
        deadline: deadlineToSend
      });
      
      const response = await updateTodo(editTask.id, {
        activity: editTitle,
        description: editDescription,
        deadline: deadlineToSend,
      });
      
      console.log("UPDATE RESPONSE:", response);
      
      await new Promise(r => setTimeout(r, 300));
      await fetchTodos();
      setShowEditModal(false);
      setEditTask(null);
      showToast("✓ Tugas berhasil diupdate!");
    } catch (err: any) {
      console.error("Error update:", err);
      setEditError(err.message ?? "Gagal mengupdate tugas");
    } finally {
      setIsEditLoading(false);
    }
  }

  async function handleAddTask() {
    if (!newTitle.trim()) { setError("Judul tugas tidak boleh kosong!"); return; }
    setIsLoading(true);
    setError("");
    try {
      await createTodo(newTitle, newDate || undefined);
      const data = await getMyTodos();
      setTasks(data);
      setNewTitle("");
      setNewDate("");
      setShowModal(false);
      showToast("✓ Tugas berhasil ditambahkan!");
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAbsen() {
    setIsAbsenLoading(true);
    setAbsenError("");
    try {
      const result = await checkIn();
      const statusDariApi = result.statusIndonesia;
      setAbsenceHistory((prev) => [{ date: today, status: statusDariApi }, ...prev]);
      setShowAbsenModal(false);
      showToast("✓ Absensi berhasil dicatat!");
    } catch (err: any) {
      setAbsenError(err.message ?? "Gagal melakukan absensi");
    } finally {
      setIsAbsenLoading(false);
    }
  }

  const statusHariIni = absenceHistory.find((a) => a.date === today)?.status;

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">

      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast.message}
        </div>
      )}

      <h1 className="text-xl lg:text-2xl font-semibold mb-1">Tugas & Absensi</h1>
      <p className="text-gray-500 text-sm lg:text-base mb-4 lg:mb-6">
        Selesaikan tugas Anda terlebih dahulu sebelum dapat melakukan absensi
      </p>

      {/* Stat Cards dengan animasi */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="dashboard-stat-card">
          <StatCard title="Tugas Tertunda" value={pending.length.toString()} color="red" />
        </div>
        <div className="dashboard-stat-card">
          <StatCard title="Tugas Selesai" value={completed.length.toString()} color="green" />
        </div>
        <div className="dashboard-stat-card">
          <StatCard
            title="Status Absensi"
            value={statusHariIni ?? "-"}
            color={statusHariIni === "Hadir" ? "green" : statusHariIni === "Terlambat" ? "blue" : statusHariIni === "Alpa" ? "red" : "blue"}
          />
        </div>
        <div className="dashboard-stat-card">
          <StatCard
            title="Progress"
            value={tasks.length > 0 ? `${Math.round((completed.length / tasks.length) * 100)}%` : "0%"}
            color="purple"
          />
        </div>
      </div>

      {/* Tab buttons dengan animasi */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
        <div className="dashboard-stat-card">
          <button 
            onClick={() => setActiveTab("tasks")} 
            className={`w-full py-2 rounded-xl font-medium text-sm lg:text-base ${activeTab === "tasks" ? "bg-white shadow" : "bg-gray-100 text-gray-400"}`}
          >
            Tugas ({pending.length})
          </button>
        </div>
        <div className="dashboard-stat-card">
          <button 
            onClick={() => setActiveTab("absence")} 
            className={`w-full py-2 rounded-xl font-medium text-sm lg:text-base ${activeTab === "absence" ? "bg-white shadow" : "bg-gray-100 text-gray-400"}`}
          >
            Absensi
          </button>
        </div>
      </div>

      {/* Button Tambah Tugas dengan animasi */}
      <div className="dashboard-stat-card">
        <button 
          onClick={() => setShowModal(true)} 
          className="w-full bg-blue-600 text-white py-2 rounded mb-4 lg:mb-6 text-sm lg:text-base"
        >
          + Tambah Tugas Baru
        </button>
      </div>

      {/* Modal Tambah */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 lg:p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Tambah Tugas Baru</h2>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Judul Tugas</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Contoh: Kerjakan PR Matematika" className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Batas Waktu</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={todayISO} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowModal(false); setError(""); }} className="flex-1 py-2 rounded-lg border text-gray-500 hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleAddTask} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 text-sm">{isLoading ? "Menyimpan..." : "Simpan"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL EDIT YANG SUDAH DIPERBAIKI ========== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 lg:p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Edit Tugas</h2>
            {editError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{editError}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Judul Tugas</label>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Deskripsi</label>
                <input 
                  type="text" 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  placeholder="Opsional" 
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Batas Waktu</label>
                <input 
                  type="date" 
                  value={editDeadline} 
                  onChange={(e) => setEditDeadline(e.target.value)} 
                  min={todayISO} 
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button 
                onClick={() => { setShowEditModal(false); setEditTask(null); }} 
                className="flex-1 py-2 rounded-lg border text-gray-500 hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveEdit} 
                disabled={isEditLoading} 
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 text-sm"
              >
                {isEditLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Absen */}
      {showAbsenModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-5 lg:p-6 w-full max-w-sm shadow-xl text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-lg font-semibold mb-1">Konfirmasi Absensi</h2>
            <p className="text-gray-500 text-sm mb-3">Apakah kamu yakin ingin melakukan absensi hari ini?</p>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${statusAbsenSekarang === "Hadir" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              Status: {statusAbsenSekarang}
            </div>
            {absenError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{absenError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setShowAbsenModal(false); setAbsenError(""); }} className="flex-1 py-2 rounded-lg border text-gray-500 hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleAbsen} disabled={isAbsenLoading} className={`flex-1 py-2 rounded-lg text-white disabled:opacity-50 text-sm ${statusAbsenSekarang === "Hadir" ? "bg-green-600" : "bg-yellow-500"}`}>
                {isAbsenLoading ? "Memproses..." : "Ya, Absen Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Tugas */}
      {activeTab === "tasks" && (
        <>
          {isLoadingTasks ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-2xl mb-2">⏳</p>
              <p className="text-sm">Memuat tugas...</p>
            </div>
          ) : (
            <>
              <h2 className="font-semibold mb-3 text-sm lg:text-base">Tugas Tertunda</h2>
              {pending.length === 0 && <p className="text-gray-400 text-sm mb-4">Tidak ada tugas tertunda.</p>}
              {pending.map((task, index) => (
                <div key={task.id} className="dashboard-stat-card" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                  <TaskItem task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleOpenEdit} />
                </div>
              ))}
              
              <h2 className="font-semibold mt-6 mb-3 text-sm lg:text-base">Tugas Selesai</h2>
              {completed.length === 0 && <p className="text-gray-400 text-sm">Belum ada tugas selesai.</p>}
              {completed.map((task, index) => (
                <div key={task.id} className="dashboard-stat-card" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
                  <TaskItem task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleOpenEdit} />
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* Tab Absensi */}
      {activeTab === "absence" && (
        <div id="absen-section" className="space-y-4 lg:space-y-6">
          {/* Section Absen Hari Ini */}
          <div className="dashboard-stat-card">
            <div className="border rounded-xl p-4 lg:p-6 bg-blue-50">
              <h3 className="font-semibold text-sm lg:text-base">Absen Hari Ini</h3>
              <p className="text-sm text-gray-500 mb-4">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>

              {tasks.length === 0 && !sudahLewatBatas && (
                <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
                  ⚠ Tombol Absensi Dinonaktifkan<br />
                  Kamu belum input tugas apapun. Tambahkan minimal 1 tugas terlebih dahulu.
                  <button onClick={() => { setActiveTab("tasks"); setShowModal(true); }} className="block mt-2 text-blue-600 underline text-xs">+ Tambah tugas sekarang</button>
                </div>
              )}

              {sudahLewatBatas && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">❌ Waktu absensi sudah habis!</div>
              )}

              {statusAbsenSekarang === "Terlambat" && !sudahAbsenHariIni && (
                <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
                  ⚠ Kamu akan tercatat <strong>Terlambat</strong> jika melakukan absen sekarang.<br />Batas hadir sudah lewat!
                </div>
              )}

              {sudahAbsenHariIni && (
                <div className={`p-3 rounded mb-4 text-sm ${
                  statusHariIni === "Hadir" ? "bg-green-100 text-green-700"
                  : statusHariIni === "Terlambat" ? "bg-yellow-100 text-yellow-700"
                  : statusHariIni === "Sakit" ? "bg-blue-100 text-blue-700"
                  : statusHariIni === "Izin" ? "bg-purple-100 text-purple-700"
                  : "bg-red-100 text-red-700"
                }`}>
                  {statusHariIni === "Hadir" && "✓ Kamu sudah absen hari ini — Hadir!"}
                  {statusHariIni === "Terlambat" && "⚠ Kamu sudah absen hari ini — Terlambat."}
                  {statusHariIni === "Sakit" && "🤒 Kamu tercatat Sakit hari ini."}
                  {statusHariIni === "Izin" && "📝 Kamu tercatat Izin hari ini."}
                  {statusHariIni === "Alpa" && <span>❌ Kamu sudah tercatat <strong>Alpa</strong> hari ini.</span>}
                </div>
              )}

              <button
                disabled={absenDisabled}
                onClick={() => !absenDisabled && setShowAbsenModal(true)}
                className={`w-24 h-24 lg:w-28 lg:h-28 rounded-full flex flex-col items-center justify-center mx-auto shadow-2xl border-4 transition-all duration-300 ${absenDisabled ? "bg-gray-300 text-gray-400 cursor-not-allowed border-gray-200" : statusAbsenSekarang === "Terlambat" ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white cursor-pointer border-yellow-300 hover:scale-105" : "bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-green-300 hover:scale-105"}`}
              >
                <span className="text-lg lg:text-xl">{absenDisabled ? "🔒" : statusAbsenSekarang === "Terlambat" ? "⚠" : "✓"}</span>
                <span className="font-bold text-xs lg:text-sm">Absensi</span>
              </button>

              {!absenDisabled && (
                <p className={`text-center text-xs lg:text-sm mt-3 ${statusAbsenSekarang === "Terlambat" ? "text-yellow-600" : "text-green-600"}`}>
                  {statusAbsenSekarang === "Terlambat" ? "Kamu akan tercatat terlambat ⚠" : "Kamu bisa absen sekarang ✓"}
                </p>
              )}
            </div>
          </div>

          {/* Riwayat Absensi */}
          <div className="dashboard-stat-card">
            <h3 className="font-semibold mb-3 text-sm lg:text-base">Riwayat Absensi</h3>
            {isLoadingHistory ? (
              <div className="text-center py-6 text-gray-400">
                <p className="text-sm">Memuat riwayat...</p>
              </div>
            ) : absenceHistory.length === 0 ? (
              <p className="text-gray-400 text-sm">Belum ada riwayat absensi.</p>
            ) : (
              absenceHistory.map((item, i) => (
                <div key={i} className="dashboard-stat-card" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                  <AbsenceItem date={item.date} status={item.status} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color = "blue" }: { title: string; value: string; color?: string }) {
  const colors: Record<string, string> = { red: "text-red-500", green: "text-green-500", purple: "text-purple-500", blue: "text-blue-500" };
  return (
    <div className="bg-white rounded-xl p-3 lg:p-4 shadow">
      <p className="text-gray-500 text-xs lg:text-sm">{title}</p>
      <h2 className={`text-xl lg:text-2xl font-bold ${colors[color]}`}>{value}</h2>
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onEdit }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }) {
  return (
    <div className={`border rounded-xl p-3 lg:p-4 mb-3 lg:mb-4 flex justify-between items-center gap-2 ${task.done ? "border-green-400" : "border-blue-500"}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm lg:text-base truncate ${task.done ? "line-through text-gray-400" : ""}`}>{task.title}</p>
        {!task.done && task.date && (
          <span className="text-xs text-gray-400 mt-1 block">{task.date}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {!task.done && (
          <button onClick={() => onEdit(task)} className="text-blue-400 hover:text-blue-600 text-xs bg-blue-50 hover:bg-blue-100 rounded px-2 py-1">✏</button>
        )}
        <button onClick={() => onDelete(task.id)} className="text-red-400 hover:text-red-600 text-xs bg-red-100 hover:bg-red-200 rounded px-2 py-1">−</button>
        <input type="checkbox" checked={task.done ?? false} onChange={() => onToggle(task.id)} className="w-4 h-4 cursor-pointer shrink-0" />
      </div>
    </div>
  );
}

function AbsenceItem({ date, status }: { date: string; status: "Hadir" | "Terlambat" | "Alpa" | "Sakit" | "Izin" }) {
  const styles = {
    Hadir: "bg-green-100 text-green-700",
    Terlambat: "bg-yellow-100 text-yellow-700",
    Alpa: "bg-red-100 text-red-700",
    Sakit: "bg-blue-100 text-blue-700",
    Izin: "bg-purple-100 text-purple-700",
  };
  return (
    <div className={`p-3 lg:p-4 rounded-xl mb-3 flex justify-between text-sm ${styles[status]}`}>
      <span>{date}</span>
      <span className="font-medium">{status}</span>
    </div>
  );
}