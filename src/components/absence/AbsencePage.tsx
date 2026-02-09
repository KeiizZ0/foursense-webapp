"use client";

type Task = {
  id: number;
  title: string;
  status: "Urgent" | "Normal";
  date?: string;
  done?: boolean;
};

import { useState } from "react";

export default function AbsencePage() {
     const [activeTab, setActiveTab] = useState<"tasks" | "absence">("tasks");
  const tasks: Task[] = [
    {
      id: 1,
      title: "Kerjakan Matematika Halaman 10–15",
      status: "Urgent",
      date: "20 Nov",
    },
    {
      id: 2,
      title: "Tugas Sains: Laporan Eksperimen",
      status: "Urgent",
      date: "22 Nov",
    },
    {
      id: 3,
      title: "Bahasa Inggris: Essay Writing",
      status: "Normal",
      date: "21 Nov",
    },
    {
      id: 4,
      title: "Baca Bab 5 Sejarah",
      status: "Normal",
      done: true,
    },
  ];

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

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
        <StatCard title="Status Absensi" value="-" />
        <StatCard
          title="Progress"
          value={`${Math.round((completed.length / tasks.length) * 100)}%`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">

  <button
    onClick={() => setActiveTab("tasks")}
    className={`py-2 rounded-xl font-medium
      ${activeTab === "tasks"
        ? "bg-white shadow"
        : "bg-gray-100 text-gray-400"}
    `}
  >
    Tugas ({pending.length})
  </button>

  <button
    onClick={() => setActiveTab("absence")}
    className={`py-2 rounded-xl font-medium
      ${activeTab === "absence"
        ? "bg-white shadow"
        : "bg-gray-100 text-gray-400"}
    `}
  >
    Absensi
  </button>

</div>


      <button className="w-full bg-blue-600 text-white py-2 rounded mb-6">
        + Tambah Tugas Baru
      </button>

     {activeTab === "tasks" && (
  <>
    <h2 className="font-semibold mb-3">Tugas Tertunda</h2>

    {pending.map((task) => (
      <TaskItem key={task.id} task={task} />
    ))}

    <h2 className="font-semibold mt-6 mb-3">Tugas Selesai</h2>

    {completed.map((task) => (
      <TaskItem key={task.id} task={task} />
    ))}
  </>
)}

{activeTab === "absence" && (
  <div className="space-y-6">

    {/* Absen Hari Ini */}
    <div className="border rounded-xl p-6 bg-blue-50">

      <h3 className="font-semibold">Absen Hari Ini</h3>
      <p className="text-sm text-gray-500 mb-4">
        Senin, 9 Februari
      </p>

      <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
        ⚠ Tombol Absensi Dinonaktifkan
        <br />
        Selesaikan 3 tugas di tab Tugas sebelum melakukan absensi.
      </div>

      <button
        disabled
        className="w-full py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
      >
        Absensi 
      </button>
    </div>

    {/* Riwayat Absensi */}
    <div>
      <h3 className="font-semibold mb-3">Riwayat Absensi</h3>

      <AbsenceItem date="18/11/2025" status="Hadir" />
      <AbsenceItem date="17/11/2025" status="Hadir" />
      <AbsenceItem date="16/11/2025" status="Terlambat" />
      <AbsenceItem date="15/11/2025" status="Hadir" />
      <AbsenceItem date="14/11/2025" status="Absen" />
    </div>

  </div>
)}



      

    

      {completed.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

/* ===== Components in same file ===== */

function StatCard({
  title,
  value,
  color = "blue",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  const colors: Record<string, string> = {
    red: "text-red-500",
    green: "text-green-500",
    purple: "text-purple-500",
    blue: "text-blue-500",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold ${colors[color]}`}>
        {value}
      </h2>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div
      className={`border rounded-xl p-4 mb-4 flex justify-between items-center
        ${task.done ? "border-green-400" : "border-blue-500"}
      `}
    >
      <div>
        <p className={`${task.done && "line-through text-gray-400"}`}>
          {task.title}
        </p>

        {!task.done && (
          <>
            <span
              className={`text-xs px-2 py-1 rounded mr-2
                ${task.status === "Urgent"
                  ? "bg-red-100 text-red-500"
                  : "bg-yellow-100 text-yellow-600"}
              `}
            >
              {task.status}
            </span>

            <span className="text-xs text-gray-400">{task.date}</span>
          </>
        )}
      </div>

      <input type="checkbox" defaultChecked={task.done} />
    </div>
  );
}

function AbsenceItem({
  date,
  status,
}: {
  date: string;
  status: "Hadir" | "Terlambat" | "Absen";
}) {
  const styles = {
    Hadir: "bg-green-100 text-green-700",
    Terlambat: "bg-yellow-100 text-yellow-700",
    Absen: "bg-red-100 text-red-700",
  };

  return (
    <div className={`p-4 rounded-xl mb-3 flex justify-between ${styles[status]}`}>
      <span>{date}</span>
      <span className="font-medium">{status}</span>
    </div>
  );
}

