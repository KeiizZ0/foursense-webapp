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
import React from 'react';
import { createTodo, getMyTodos, markAsDone, deleteTodo, updateTodo } from "@/restApi/todo.api";
import { checkIn } from "@/restApi/absence.api";
import { useUserStorage } from "@/store/user.store";
import { ApiClient } from "@/lib/helpers/axios";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle, XCircle, Clock, Calendar, Plus, Edit2, Trash2, 
  TrendingUp, UserCheck, UserX, AlertCircle, BookOpen, Heart,
  ChevronRight, ChevronLeft, X, Check, MapPin, Loader2
} from "lucide-react";

// ============================================================
// koordinat sekolah
const SCHOOL_LAT = -6.9418;
const SCHOOL_LNG = 107.6285;
const MAX_DISTANCE_METER = 100;
// ============================================================

function hitungJarak(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function AbsencePage() {
  const searchParams = useSearchParams();
  const { myData } = useUserStorage();
  const [activeTab, setActiveTab] = useState<"tasks" | "absence">("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [absenceHistory, setAbsenceHistory] = useState<AbsenceRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  // === STATE GEOLOCATION (TAMBAHAN) ===
  const [lokasiValid, setLokasiValid] = useState<boolean | null>(null);
  const [jarakMeter, setJarakMeter] = useState<number | null>(null);
  const [lokasiError, setLokasiError] = useState<string>("");
  const [isCekLokasi, setIsCekLokasi] = useState(false);

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

  const now = new Date();
  console.log("Jam browser:", now.getHours(), now.getMinutes());
  console.log("Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
  const today = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const todayISO = now.toISOString().split("T")[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Weekend check untuk disable tombol dan tampilkan notif
  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const sudahAbsenHariIni = absenceHistory.some((a) => a.date === today && a.status !== "Alpa");

  function getStatusAbsen(): "Hadir" | "Terlambat" | "Alpa" {
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

  function parseDate(dateStr: string): Date {
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  const statusAbsenSekarang = getStatusAbsen();
  console.log("statusAbsenSekarang:", statusAbsenSekarang);
  console.log("sudahAbsenHariIni:", sudahAbsenHariIni);
  console.log("absenceHistory:", absenceHistory);
  const sudahLewatBatas = statusAbsenSekarang === "Alpa";

  // Tambah lokasiValid !== true ke kondisi disabled
  const absenDisabled = tasks.length === 0 || sudahAbsenHariIni || sudahLewatBatas || isWeekend || lokasiValid !== true;

  // === FUNGSI CEK LOKASI (TAMBAHAN) ===
  function cekLokasi() {
    if (!navigator.geolocation) {
      setLokasiError("Browser tidak mendukung GPS.");
      setLokasiValid(false);
      return;
    }
    setIsCekLokasi(true);
    setLokasiError("");
    setLokasiValid(null);
    setJarakMeter(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const jarak = hitungJarak(
          pos.coords.latitude,
          pos.coords.longitude,
          SCHOOL_LAT,
          SCHOOL_LNG
        );
        const jarakBulat = Math.round(jarak);
        setJarakMeter(jarakBulat);
        setLokasiValid(jarak <= MAX_DISTANCE_METER);
        setIsCekLokasi(false);
      },
      (err) => {
        if (err.code === 1) setLokasiError("Izin lokasi ditolak. Aktifkan GPS di browser kamu.");
        else if (err.code === 2) setLokasiError("Lokasi tidak tersedia. Pastikan GPS aktif.");
        else setLokasiError("Gagal mendapatkan lokasi. Coba lagi.");
        setLokasiValid(false);
        setIsCekLokasi(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Auto cek lokasi saat tab absensi dibuka
  useEffect(() => {
    if (activeTab === "absence" && !isWeekend && !sudahAbsenHariIni && !sudahLewatBatas) {
      cekLokasi();
    }
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const openModal = searchParams.get('openModal');
    if (tab === 'absence') {
      setActiveTab('absence');
      setTimeout(() => {
        const absenSection = document.getElementById('absen-section');
        if (absenSection) absenSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      if (openModal === 'true' && !sudahAbsenHariIni && !sudahLewatBatas && !isWeekend && tasks.length > 0) {
        setTimeout(() => setShowAbsenModal(true), 500);
      }
    }
  }, [searchParams, sudahAbsenHariIni, sudahLewatBatas, isWeekend, tasks.length]);

  async function fetchTodos() {
    setIsLoadingTasks(true);
    try {
      const data = await getMyTodos();
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
        params: { student: studentId, limit: 100 },
      });

      const all = response.data?.data?.absences || [];
      const userName = myData?.name;

      const mine = Array.isArray(all)
        ? all.filter((a: any) => a.student?.user?.name === userName)
        : [];

      const mapped: AbsenceRecord[] = mine
        .map((a: any) => ({
          date: new Date(a.absenceAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          }),
          status: mapStatusAbsen(a.status),
          _raw: new Date(a.absenceAt),
        }))
        .filter((a: any) => {
          return a._raw.getMonth() === currentMonth && a._raw.getFullYear() === currentYear;
        })
        .map(({ _raw, ...rest }: any) => rest);

      // FIX: Hitung isWeekend dan lewatBatas secara lokal di sini
      // agar tidak bergantung pada state/closure yang mungkin stale
      const nowLocal = new Date();
      const dayOfWeekLocal = nowLocal.getDay();
      const isWeekendLocal = dayOfWeekLocal === 0 || dayOfWeekLocal === 6;
      const totalMenitLocal = nowLocal.getHours() * 60 + nowLocal.getMinutes();
      const lewatBatasLocal = totalMenitLocal >= 10 * 60;
      

      const todayLocal = nowLocal.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const sudahAdaHariIni = mapped.some((a) => a.date === todayLocal);

      // Hanya insert Alpa jika: belum ada absen hari ini, sudah lewat batas, DAN bukan weekend
      if (!sudahAdaHariIni && lewatBatasLocal && !isWeekendLocal) {
        mapped.unshift({ date: todayLocal, status: "Alpa" });
      }

      const unique = mapped.filter((item, index, self) =>
        index === self.findIndex((t) => t.date === item.date)
      );
      unique.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
      setAbsenceHistory(unique);
    } catch (err) {
      console.error("Gagal fetch history absensi:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  useEffect(() => { fetchTodos(); }, []);
  useEffect(() => { if (myData) fetchAbsenceHistory(); }, [myData]);

  async function handleToggle(id: string) {
    try {
      const task = tasks.find(t => t.id === id);
      const wasDone = task?.done;
      
      await markAsDone(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
      
      if (wasDone) {
        showToast("✓ Tugas ditandai belum selesai");
      } else {
        showToast("✓ Tugas selesai!");
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      showToast("❌ Gagal mengupdate status tugas");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTodo(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("🗑 Tugas berhasil dihapus");
    } catch (err) {
      console.error("Gagal hapus tugas:", err);
      showToast("❌ Gagal menghapus tugas");
    }
  }

  function handleOpenEdit(task: Task) {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    let deadlineValue = "";
    if (task.deadlineISO && task.deadlineISO !== "") {
      deadlineValue = task.deadlineISO.split("T")[0];
    } else if (task.date && task.date !== "") {
      try {
        const parts = task.date.split('/');
        if (parts.length === 3) {
          deadlineValue = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } catch (e) {
        console.error("Gagal parse tanggal:", e);
      }
    }
    setEditDeadline(deadlineValue);
    setEditError("");
    setShowEditModal(true);
  }

  async function handleSaveEdit() {
    if (!editTitle.trim()) { setEditError("Judul tidak boleh kosong!"); return; }
    if (!editTask) return;
    setIsEditLoading(true);
    setEditError("");
    try {
      await updateTodo(editTask.id, {
        activity: editTitle,
        description: editDescription,
        deadline: editDeadline || undefined,
      });
      await new Promise(r => setTimeout(r, 300));
      await fetchTodos();
      setShowEditModal(false);
      setEditTask(null);
      showToast("✓ Tugas berhasil diupdate!");
    } catch (err: any) {
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
      setAbsenceHistory((prev) => {
        const updated = [{ date: today, status: statusDariApi }, ...prev.filter(a => a.date !== today)];
        updated.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
        return updated;
      });
      setShowAbsenModal(false);
      showToast("✓ Absensi berhasil dicatat!");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? "";
      if (msg.toLowerCase().includes("weekend")) {
        setAbsenError("❌ Absensi tidak tersedia di hari weekend.");
      } else {
        setAbsenError(msg || "Gagal melakukan absensi");
      }
    } finally {
      setIsAbsenLoading(false);
    }
  }

  const statusHariIni = absenceHistory.find((a) => a.date === today)?.status;

  return (
    <div className="min-h-screen bg-blue-900/10 rounded-2xl p-4 md:p-6 lg:p-8">
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gray-900 rounded-2xl shadow-2xl px-5 py-4 min-w-[280px] animate-bounce-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Berhasil!</p>
                <p className="text-gray-300 text-xs mt-0.5">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToast({ message: "", visible: false })}
                className="flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 animate-slide-down">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-blue-600 animate-pulse-subtle" />
          Tugas & Absensi
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-2 ml-1">
          Selesaikan tugas Anda terlebih dahulu sebelum dapat melakukan absensi
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-xl">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{pending.length}</span>
          </div>
          <p className="text-sm text-gray-600">Tugas Tertunda</p>
        </div>
        
        <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{completed.length}</span>
          </div>
          <p className="text-sm text-gray-600">Tugas Selesai</p>
        </div>
        
        <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl ${
              statusHariIni === "Hadir" ? "bg-green-100" : 
              statusHariIni === "Terlambat" ? "bg-yellow-100" : 
              statusHariIni === "Alpa" ? "bg-red-100" : "bg-blue-100"
            }`}>
              {statusHariIni === "Hadir" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {statusHariIni === "Terlambat" && <Clock className="w-5 h-5 text-yellow-500" />}
              {statusHariIni === "Alpa" && <XCircle className="w-5 h-5 text-red-500" />}
              {statusHariIni === "Sakit" && <Heart className="w-5 h-5 text-blue-500" />}
              {statusHariIni === "Izin" && <BookOpen className="w-5 h-5 text-purple-500" />}
              {!statusHariIni && <AlertCircle className="w-5 h-5 text-gray-400" />}
            </div>
            <span className="text-2xl font-bold text-gray-800">{statusHariIni ?? "-"}</span>
          </div>
          <p className="text-sm text-gray-600">Status Absensi</p>
        </div>
        
        <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {tasks.length > 0 ? `${Math.round((completed.length / tasks.length) * 100)}%` : "0%"}
            </span>
          </div>
          <p className="text-sm text-gray-600">Progress</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: tasks.length > 0 ? `${(completed.length / tasks.length) * 100}%` : "0%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
            activeTab === "tasks"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Tugas ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab("absence")}
          className={`flex-1 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
            activeTab === "absence"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Absensi
        </button>
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-xl mb-6 text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Tambah Tugas Baru
      </button>

      {/* Modals with enhanced animations */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-modal-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tambah Tugas Baru</h2>
              <button onClick={() => { setShowModal(false); setError(""); }} className="text-gray-400 hover:text-gray-600 transition-transform hover:scale-110">
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg animate-shake">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Judul Tugas</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="Contoh: Kerjakan PR Matematika" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Batas Waktu</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)} 
                  min={todayISO} 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setError(""); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all transform hover:scale-105">Batal</button>
              <button onClick={handleAddTask} disabled={isLoading} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95">{isLoading ? "Menyimpan..." : "Simpan"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-modal-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Tugas</h2>
              <button onClick={() => { setShowEditModal(false); setEditTask(null); }} className="text-gray-400 hover:text-gray-600 transition-transform hover:scale-110">
                <X className="w-5 h-5" />
              </button>
            </div>
            {editError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg animate-shake">{editError}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Judul Tugas</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Deskripsi</label>
                <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Opsional" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Batas Waktu</label>
                <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} min={todayISO} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowEditModal(false); setEditTask(null); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all transform hover:scale-105">Batal</button>
              <button onClick={handleSaveEdit} disabled={isEditLoading} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95">{isEditLoading ? "Menyimpan..." : "Simpan"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Absen Modal */}
      {showAbsenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center animate-modal-slide-up">
            <div className="text-6xl mb-4 animate-bounce-subtle">📋</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">Konfirmasi Absensi</h2>
            <p className="text-gray-500 text-sm mb-4">Apakah kamu yakin ingin melakukan absensi hari ini?</p>

            {/* Info jarak di modal */}
            {jarakMeter !== null && (
              <div className="flex items-center justify-center gap-1.5 text-green-600 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>Kamu berada <strong>{jarakMeter}m</strong> dari sekolah</span>
              </div>
            )}

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5 ${
              statusAbsenSekarang === "Hadir" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {statusAbsenSekarang === "Hadir" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              Status: {statusAbsenSekarang}
            </div>
            {absenError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded-lg animate-shake">{absenError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setShowAbsenModal(false); setAbsenError(""); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all transform hover:scale-105">Batal</button>
              <button onClick={handleAbsen} disabled={isAbsenLoading} className={`flex-1 py-2.5 rounded-xl text-white disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95 ${
                statusAbsenSekarang === "Hadir" ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 hover:bg-yellow-600"
              }`}>
                {isAbsenLoading ? "Memproses..." : "Ya, Absen Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          {isLoadingTasks ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-3">Memuat tugas...</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500 animate-pulse-subtle" />
                  Tugas Tertunda
                </h2>
                {pending.length === 0 && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center animate-fade-in">
                    <p className="text-gray-400">Tidak ada tugas tertunda.</p>
                  </div>
                )}
                {pending.map((task, index) => (
                  <div key={task.id} className="dashboard-stat-card" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                    <TaskItem task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleOpenEdit} />
                  </div>
                ))}
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 animate-pulse-subtle" />
                  Tugas Selesai
                </h2>
                {completed.length === 0 && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center animate-fade-in">
                    <p className="text-gray-400"> Belum ada tugas selesai.</p>
                  </div>
                )}
                {completed.map((task, index) => (
                  <div key={task.id} className="dashboard-stat-card" style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
                    <TaskItem task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleOpenEdit} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Absence Tab */}
      {activeTab === "absence" && (
        <div id="absen-section" className="space-y-6">
          {/* Today's Attendance Card */}
          <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Absen Hari Ini
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>

            {/* === BANNER STATUS LOKASI (TAMBAHAN) === */}
            {!isWeekend && !sudahAbsenHariIni && !sudahLewatBatas && (
              <div className={`p-4 rounded-xl mb-4 text-sm border flex items-start gap-3 transition-all duration-300 ${
                isCekLokasi ? "bg-blue-50 border-blue-200 text-blue-700" :
                lokasiValid === true ? "bg-green-50 border-green-200 text-green-700" :
                lokasiValid === false ? "bg-red-50 border-red-200 text-red-700" :
                "bg-gray-50 border-gray-200 text-gray-500"
              }`}>
                <div className="mt-0.5 shrink-0">
                  {isCekLokasi ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  {isCekLokasi && <p className="font-medium">Mengecek lokasi kamu...</p>}
                  {!isCekLokasi && lokasiValid === true && (
                    <p>✓ Lokasi valid — kamu berada <strong>{jarakMeter}m</strong> dari sekolah</p>
                  )}
                  {!isCekLokasi && lokasiValid === false && lokasiError && (
                    <p>{lokasiError}</p>
                  )}
                  {!isCekLokasi && lokasiValid === false && !lokasiError && jarakMeter !== null && (
                    <p>❌ Terlalu jauh — kamu berada <strong>{jarakMeter}m</strong> dari sekolah. Harus dalam <strong>{MAX_DISTANCE_METER}m</strong> untuk absen.</p>
                  )}
                  {!isCekLokasi && lokasiValid === null && <p>Lokasi belum dicek.</p>}
                  {!isCekLokasi && (
                    <button onClick={cekLokasi} className="mt-1.5 text-xs underline opacity-60 hover:opacity-100 transition-opacity">
                      🔄 Cek ulang lokasi
                    </button>
                  )}
                </div>
              </div>
            )}

            {isWeekend && (
              <div className="bg-gray-100 text-gray-600 p-4 rounded-xl mb-4 text-sm flex items-center gap-2 animate-fade-in">
                <span>😴</span> Hari ini hari libur weekend — absensi tidak tersedia!
              </div>
            )}

            {!isWeekend && tasks.length === 0 && !sudahLewatBatas && (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl mb-4 text-sm border border-yellow-200 animate-fade-in">
                <p className="font-medium mb-2">⚠️ Tombol Absensi Dinonaktifkan</p>
                <p className="text-sm">Kamu belum input tugas apapun. Tambahkan minimal 1 tugas terlebih dahulu.</p>
                <button onClick={() => { setActiveTab("tasks"); setShowModal(true); }} className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium underline transition-all hover:scale-105">+ Tambah tugas sekarang</button>
              </div>
            )}

            {!isWeekend && sudahLewatBatas && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 text-sm border border-red-200 flex items-center gap-2 animate-fade-in">
                <XCircle className="w-5 h-5" /> Waktu absensi sudah habis!
              </div>
            )}

            {!isWeekend && statusAbsenSekarang === "Terlambat" && !sudahAbsenHariIni && (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl mb-4 text-sm border border-yellow-200 animate-fade-in">
                <p className="font-medium">⚠️ Kamu akan tercatat <strong>Terlambat</strong> jika melakukan absen sekarang.</p>
                <p className="text-sm mt-1">Batas hadir sudah lewat (sebelum jam 07:00 untuk hadir, sebelum jam 10:00 untuk tidak terlambat)</p>
              </div>
            )}

            {sudahAbsenHariIni && (
              <div className={`p-4 rounded-xl mb-4 text-sm border animate-fade-in ${
                statusHariIni === "Hadir" ? "bg-green-50 text-green-700 border-green-200" :
                statusHariIni === "Terlambat" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                statusHariIni === "Sakit" ? "bg-blue-50 text-blue-700 border-blue-200" :
                statusHariIni === "Izin" ? "bg-purple-50 text-purple-700 border-purple-200" :
                "bg-red-50 text-red-700 border-red-200"
              }`}>
                {statusHariIni === "Hadir" && "✓ Kamu sudah absen hari ini — Hadir!"}
                {statusHariIni === "Terlambat" && "⚠ Kamu sudah absen hari ini — Terlambat."}
                {statusHariIni === "Sakit" && "Kamu tercatat Sakit hari ini."}
                {statusHariIni === "Izin" && "Kamu tercatat Izin hari ini."}
                {statusHariIni === "Alpa" && "❌ Kamu sudah tercatat Alpa hari ini."}
              </div>
            )}

            <button
              disabled={absenDisabled}
              onClick={() => !absenDisabled && setShowAbsenModal(true)}
              className={`w-28 h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center mx-auto shadow-xl border-4 transition-all duration-300 ${
                absenDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300" : 
                statusAbsenSekarang === "Terlambat" ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white cursor-pointer border-yellow-300 hover:scale-110 hover:shadow-2xl" : 
                "bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-green-300 hover:scale-110 hover:shadow-2xl"
              }`}
            >
              <span className="text-2xl lg:text-3xl mb-1">
                {isCekLokasi ? "⏳" : absenDisabled ? "🔒" : statusAbsenSekarang === "Terlambat" ? "⚠️" : "✓"}
              </span>
              <span className="font-bold text-sm lg:text-base">Absensi</span>
            </button>

            {!absenDisabled && (
              <p className={`text-center text-sm mt-4 ${statusAbsenSekarang === "Terlambat" ? "text-yellow-600" : "text-green-600"} animate-pulse-subtle`}>
                {statusAbsenSekarang === "Terlambat" ? "⚠️ Kamu akan tercatat terlambat" : "✅ Kamu bisa absen sekarang"}
              </p>
            )}
          </div>

          {/* History Card */}
          <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Riwayat Absensi
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </p>
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-400 mt-2 text-sm">Memuat riwayat...</p>
              </div>
            ) : absenceHistory.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl animate-fade-in">
                <p className="text-gray-400 text-sm">Belum ada riwayat absensi bulan ini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {absenceHistory.map((item, i) => (
                  <div key={i} className="dashboard-stat-card" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                    <AbsenceItem date={item.date} status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onEdit }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }) {
  return (
    <div className={`bg-white rounded-xl p-4 mb-3 flex justify-between items-center gap-3 shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
      task.done ? "border-green-200 bg-green-50/30" : "border-gray-100"
    }`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm md:text-base truncate ${task.done ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}>
          {task.title}
        </p>
        {!task.done && task.date && (
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{task.date}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!task.done && (
          <button 
            onClick={() => onEdit(task)} 
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
            title="Edit tugas"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => onDelete(task.id)} 
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
          title="Hapus tugas"
        >
          <X className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onToggle(task.id)} 
          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
            task.done 
              ? "text-green-600 hover:text-green-700 hover:bg-green-100" 
              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
          }`}
          title={task.done ? "Tandai belum selesai" : "Tandai selesai"}
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function AbsenceItem({ date, status }: { date: string; status: "Hadir" | "Terlambat" | "Alpa" | "Sakit" | "Izin" }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Hadir: { bg: "bg-green-50", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
    Terlambat: { bg: "bg-yellow-50", text: "text-yellow-700", icon: <Clock className="w-4 h-4" /> },
    Alpa: { bg: "bg-red-50", text: "text-red-700", icon: <XCircle className="w-4 h-4" /> },
    Sakit: { bg: "bg-blue-50", text: "text-blue-700", icon: <Heart className="w-4 h-4" /> },
    Izin: { bg: "bg-purple-50", text: "text-purple-700", icon: <BookOpen className="w-4 h-4" /> },
  };
  const style = styles[status];
  return (
    <div className={`${style.bg} rounded-xl p-3 flex justify-between items-center border border-${status === "Hadir" ? "green" : status === "Terlambat" ? "yellow" : status === "Alpa" ? "red" : status === "Sakit" ? "blue" : "purple"}-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
      <span className="text-sm font-medium text-gray-700">{date}</span>
      <div className={`flex items-center gap-1.5 ${style.text} font-medium text-sm`}>
        {style.icon}
        <span>{status}</span>
      </div>
    </div>
  );
}