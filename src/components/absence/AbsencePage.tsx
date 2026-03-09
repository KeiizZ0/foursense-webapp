"use client";

type Task = {
  id: number;
  title: string;
  status: "Urgent" | "Normal";
  date?: string;
  done?: boolean;
};

type AbsenceRecord = {
  date: string;
  status: "Hadir" | "Terlambat" | "Alfa";
};

import { useState, useEffect } from "react";
import { createTodo } from "@/restApi/todo.api";
import { checkIn } from "@/restApi/absence.api";

export default function AbsencePage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "absence">("tasks");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Kerjakan Matematika Halaman 10–15", status: "Urgent", date: "20 Nov" },
    { id: 2, title: "Tugas Sains: Laporan Eksperimen", status: "Urgent", date: "22 Nov" },
    { id: 3, title: "Bahasa Inggris: Essay Writing", status: "Normal", date: "21 Nov" },
    { id: 4, title: "Baca Bab 5 Sejarah", status: "Normal", done: true },
  ]);

  const [absenceHistory, setAbsenceHistory] = useState<AbsenceRecord[]>([
    { date: "18/11/2025", status: "Hadir" },
    { date: "17/11/2025", status: "Hadir" },
    { date: "16/11/2025", status: "Terlambat" },
    { date: "15/11/2025", status: "Hadir" },
    { date: "14/11/2025", status: "Alfa" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAbsenModal, setShowAbsenModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<"Urgent" | "Normal">("Normal");
  const [newDate, setNewDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAbsenLoading, setIsAbsenLoading] = useState(false);
  const [error, setError] = useState("");
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

  function getStatusAbsen(): "Hadir" | "Terlambat" | "Alfa" {
    const now = new Date();
    const totalMenit = now.getHours() * 60 + now.getMinutes();
    if (totalMenit < 7 * 60) return "Hadir";
    if (totalMenit < 10 * 60) return "Terlambat";
    return "Alfa";
  }

  const statusAbsenSekarang = getStatusAbsen();
  const sudahLewatBatas = statusAbsenSekarang === "Alfa";
  const absenDisabled = tasks.length === 0 || sudahAbsenHariIni || sudahLewatBatas;

  useEffect(() => {
    if (sudahLewatBatas && !sudahAbsenHariIni) {
      setAbsenceHistory((prev) => {
        const udahAda = prev.some((a) => a.date === today);
        if (udahAda) return prev;
        return [{ date: today, status: "Alfa" }, ...prev];
      });
    }
  }, []);

  function handleToggle(id: number) {
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, done: !t.done } : t)
    );
  }

  async function handleAddTask() {
    if (!newTitle.trim()) {
      setError("Judul tugas tidak boleh kosong!");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await createTodo({
        title: newTitle,
        status: newStatus,
        date: newDate || undefined,
        done: false,
      });
      const newTask: Task = {
        id: data.id ?? Date.now(),
        title: newTitle,
        status: newStatus,
        date: newDate || undefined,
        done: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      setNewTitle("");
      setNewStatus("Normal");
      setNewDate("");
      setShowModal(false);
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
      await checkIn();
      setAbsenceHistory((prev) => [
        { date: today, status: statusAbsenSekarang },
        ...prev,
      ]);
      setShowAbsenModal(false);
    } catch (err: any) {
      setAbsenError(err.message ?? "Gagal melakukan absensi");
    } finally {
      setIsAbsenLoading(false);
    }
  }

  const statusHariIni = absenceHistory.find((a) => a.date === today)?.status;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-1">Tugas & Absensi</h1>
      <p className="text-gray-500 mb-6">
        Selesaikan tugas Anda terlebih dahulu sebelum dapat melakukan absensi
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Tugas Tertunda" value={pending.length.toString()} color="red" />
        <StatCard title="Tugas Selesai" value={completed.length.toString()} color="green" />
        <StatCard
          title="Status Absensi"
          value={statusHariIni ?? "-"}
          color={
            statusHariIni === "Hadir" ? "green"
            : statusHariIni === "Terlambat" ? "blue"
            : statusHariIni === "Alfa" ? "red"
            : "blue"
          }
        />
        <StatCard
          title="Progress"
          value={tasks.length > 0 ? `${Math.round((completed.length / tasks.length) * 100)}%` : "0%"}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`py-2 rounded-xl font-medium ${
            activeTab === "tasks" ? "bg-white shadow" : "bg-gray-100 text-gray-400"
          }`}
        >
          Tugas ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab("absence")}
          className={`py-2 rounded-xl font-medium ${
            activeTab === "absence" ? "bg-white shadow" : "bg-gray-100 text-gray-400"
          }`}
        >
          Absensi
        </button>
      </div>

      {/* Tombol tambah tugas */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 text-white py-2 rounded mb-6"
      >
        + Tambah Tugas Baru
      </button>

      {/* ── Modal Tambah Tugas ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Tambah Tugas Baru</h2>
            {error && (
              <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>
            )}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Judul Tugas</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Kerjakan PR Matematika"
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "Urgent" | "Normal")}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Batas Waktu</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={todayISO}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="flex-1 py-2 rounded-lg border text-gray-500 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAddTask}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Absensi ── */}
      {showAbsenModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-lg font-semibold mb-1">Konfirmasi Absensi</h2>
            <p className="text-gray-500 text-sm mb-3">
              Apakah kamu yakin ingin melakukan absensi hari ini?
            </p>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              statusAbsenSekarang === "Hadir"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              Status: {statusAbsenSekarang}
            </div>

            {absenError && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{absenError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowAbsenModal(false); setAbsenError(""); }}
                className="flex-1 py-2 rounded-lg border text-gray-500 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAbsen}
                disabled={isAbsenLoading}
                className={`flex-1 py-2 rounded-lg text-white disabled:opacity-50 ${
                  statusAbsenSekarang === "Hadir" ? "bg-green-600" : "bg-yellow-500"
                }`}
              >
                {isAbsenLoading ? "Memproses..." : "Ya, Absen Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tugas */}
      {activeTab === "tasks" && (
        <>
          <h2 className="font-semibold mb-3">Tugas Tertunda</h2>
          {pending.length === 0 && (
            <p className="text-gray-400 text-sm mb-4">Tidak ada tugas tertunda.</p>
          )}
          {pending.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
          ))}
          <h2 className="font-semibold mt-6 mb-3">Tugas Selesai</h2>
          {completed.length === 0 && (
            <p className="text-gray-400 text-sm">Belum ada tugas selesai.</p>
          )}
          {completed.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </>
      )}

      {/* Tab: Absensi */}
      {activeTab === "absence" && (
        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-blue-50">
            <h3 className="font-semibold">Absen Hari Ini</h3>
            <p className="text-sm text-gray-500 mb-4">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>

            {tasks.length === 0 && !sudahLewatBatas && (
              <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
                ⚠ Tombol Absensi Dinonaktifkan
                <br />
                Kamu belum input tugas apapun. Tambahkan minimal 1 tugas terlebih dahulu.
                <button
                  onClick={() => { setActiveTab("tasks"); setShowModal(true); }}
                  className="block mt-2 text-blue-600 underline text-xs"
                >
                  + Tambah tugas sekarang
                </button>
              </div>
            )}

            {sudahLewatBatas && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                ❌ Waktu absensi sudah habis!
              </div>
            )}

            {statusAbsenSekarang === "Terlambat" && !sudahAbsenHariIni && (
              <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
                ⚠ Kamu akan tercatat <strong>Terlambat</strong> jika melakukan absen sekarang.
                <br />
                Batas hadir sudah lewat!
              </div>
            )}

            {sudahAbsenHariIni && (
              <div className={`p-3 rounded mb-4 text-sm ${
                statusHariIni === "Hadir" ? "bg-green-100 text-green-700"
                : statusHariIni === "Terlambat" ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
              }`}>
                {statusHariIni === "Hadir" && "✓ Kamu sudah absen hari ini — Hadir!"}
                {statusHariIni === "Terlambat" && "⚠ Kamu sudah absen hari ini — Terlambat."}
                {statusHariIni === "Alfa" && (
                  <span>❌ Kamu sudah tercatat <strong>Alfa</strong> hari ini.</span>
                )}
              </div>
            )}

            <button
              disabled={absenDisabled}
              onClick={() => !absenDisabled && setShowAbsenModal(true)}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto shadow-2xl border-4 transition-all duration-300
                ${absenDisabled
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed border-gray-200"
                  : statusAbsenSekarang === "Terlambat"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white cursor-pointer border-yellow-300 hover:scale-105"
                  : "bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-green-300 hover:scale-105"
                }`}
            >
              <span className="text-xl">
                {absenDisabled ? "🔒" : statusAbsenSekarang === "Terlambat" ? "⚠" : "✓"}
              </span>
              <span className="font-bold text-sm">Absensi</span>
            </button>

            {!absenDisabled && (
              <p className={`text-center text-sm mt-3 ${
                statusAbsenSekarang === "Terlambat" ? "text-yellow-600" : "text-green-600"
              }`}>
                {statusAbsenSekarang === "Terlambat"
                  ? "Kamu akan tercatat terlambat ⚠"
                  : "Kamu bisa absen sekarang ✓"}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-3">Riwayat Absensi</h3>
            {absenceHistory.length === 0 ? (
              <p className="text-gray-400 text-sm">Belum ada riwayat absensi.</p>
            ) : (
              absenceHistory.map((item, i) => (
                <AbsenceItem key={i} date={item.date} status={item.status} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color = "blue" }: { title: string; value: string; color?: string }) {
  const colors: Record<string, string> = {
    red: "text-red-500",
    green: "text-green-500",
    purple: "text-purple-500",
    blue: "text-blue-500",
  };
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold ${colors[color]}`}>{value}</h2>
    </div>
  );
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <div className={`border rounded-xl p-4 mb-4 flex justify-between items-center ${task.done ? "border-green-400" : "border-blue-500"}`}>
      <div>
        <p className={`${task.done ? "line-through text-gray-400" : ""}`}>{task.title}</p>
        {!task.done && (
          <>
            <span className={`text-xs px-2 py-1 rounded mr-2 ${task.status === "Urgent" ? "bg-red-100 text-red-500" : "bg-yellow-100 text-yellow-600"}`}>
              {task.status}
            </span>
            <span className="text-xs text-gray-400">{task.date}</span>
          </>
        )}
      </div>
      <input
        type="checkbox"
        checked={task.done ?? false}
        onChange={() => onToggle(task.id)}
      />
    </div>
  );
}

function AbsenceItem({ date, status }: { date: string; status: "Hadir" | "Terlambat" | "Alfa" }) {
  const styles = {
    Hadir: "bg-green-100 text-green-700",
    Terlambat: "bg-yellow-100 text-yellow-700",
    Alfa: "bg-red-100 text-red-700",
  };
  return (
    <div className={`p-4 rounded-xl mb-3 flex justify-between ${styles[status]}`}>
      <span>{date}</span>
      <span className="font-medium">{status}</span>
    </div>
  );
}