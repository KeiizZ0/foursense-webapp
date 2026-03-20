"use client";

import { useState, useEffect } from 'react';
import { getAllAbsencesNoFilter } from '@/restApi/absence.api';
import type { DashboardData } from '@/type/dashboard.type';
import { Loader2, AlertCircle } from 'lucide-react';

export default function DashboardGuru() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAllAbsencesNoFilter();
        setData(result);
      } catch (err) {
        setError('Gagal memuat data kehadiran');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
        <span>Memuat data dashboard...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-600">
        <AlertCircle className="w-8 h-8 mr-2" />
        {error || 'Tidak ada data kehadiran hari ini'}
      </div>
    );
  }

  // ===== MAPPING DATA API KE UI =====
  const statistik = {
    hadir: data.totalPresent,
    absen: data.totalAbsent,
    terlambat: data.totalLate,
    sakit: data.totalSick,
    rata: data.averageAttendance,
  };

  const majors = ['RPL', 'TKJ', 'DKV', 'TOI', 'TAV', 'TITL'];
  const dataJurusan = majors.map((jurusan) => {
    const classes = Object.keys(data.byClass).filter((key) => key.startsWith(jurusan));
    const total = classes.reduce((sum, key) => sum + (data.byClass[key]?.total || 0), 0);
    const hadir = classes.reduce((sum, key) => sum + (data.byClass[key]?.present || 0), 0);
    const absen = classes.reduce((sum, key) => sum + (data.byClass[key]?.absent || 0), 0);
    const terlambat = classes.reduce((sum, key) => sum + (data.byClass[key]?.late || 0), 0);
    return { jurusan, total, hadir, absen, terlambat };
  }).filter((d) => d.total > 0);

  const alertSiswa = data.alerts.slice(0, 6);

  const persen = (hadir: number, total: number) =>
    total > 0 ? Math.round((hadir / total) * 100) : 0;

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl font-bold">Dashboard Monitoring</h1>
      <p className="text-gray-500 mb-6">
        Pantau kehadiran siswa SMKN 4 Bandung
      </p>

      {/* ===== CARD STATISTIK ===== */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* Hadir */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <p className="text-blue-600">Hadir Hari Ini</p>
            <span className="text-green-500">●</span>
          </div>
          <h2 className="text-3xl font-bold">{statistik.hadir}</h2>
          <p className="text-sm text-gray-400">siswa hadir</p>
        </div>

        {/* Absen */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <p>Absen Hari Ini</p>
            <span className="text-red-500">●</span>
          </div>
          <h2 className="text-3xl font-bold">{statistik.absen}</h2>
          <p className="text-sm text-gray-400">siswa absen</p>
        </div>

        {/* Terlambat */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <p>Terlambat Hari Ini</p>
            <span className="text-orange-500">●</span>
          </div>
          <h2 className="text-3xl font-bold">{statistik.terlambat}</h2>
          <p className="text-sm text-gray-400">siswa terlambat</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <p>Sakit Hari Ini</p>
            <span className="text-orange-500">●</span>
          </div>
          <h2 className="text-3xl font-bold">{statistik.sakit}</h2>
          <p className="text-sm text-gray-400">siswa sakit</p>
        </div>

        {/* Rata-rata */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <p>Rata-rata Hadir</p>
            <span className="text-blue-500">📊</span>
          </div>
          <h2 className="text-3xl font-bold">{statistik.rata}%</h2>
          <p className="text-sm text-gray-400">hari ini</p>
        </div>
      </div>

      {/* ===== TABEL JURUSAN ===== */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-lg">
          Ringkasan Kehadiran Per Jurusan
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Data kehadiran hari ini untuk semua jurusan
        </p>

        <table className="table w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Jurusan</th>
              <th className="py-2">Total</th>
              <th className="py-2 text-green-600">Hadir</th>
              <th className="py-2 text-red-600">Absen</th>
              <th className="py-2 text-orange-500">Terlambat</th>
              <th className="py-2">% Persentase</th>
            </tr>
          </thead>

          <tbody>
            {dataJurusan.map((d, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-3 font-medium">{d.jurusan}</td>
                <td>{d.total}</td>
                <td className="text-green-600 font-medium">{d.hadir}</td>
                <td className="text-red-600 font-medium">{d.absen}</td>
                <td className="text-orange-500 font-medium">{d.terlambat}</td>
                <td className="w-40">
                  <div className="flex items-center gap-2">
                    <progress
                      className="progress progress-success w-24"
                      value={persen(d.hadir, d.total)}
                      max="100"
                    ></progress>
                    <span className="text-sm">
                      {persen(d.hadir, d.total)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== ALERT SISWA ===== */}
      <div className="bg-white rounded-xl shadow p-5 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-red-500">●</span>
          <h2 className="font-semibold text-lg">
            Alert - Siswa Absen dan Terlambat
          </h2>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Siswa yang tidak hadir atau terlambat hari ini
        </p>

        {alertSiswa.map((s, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded-lg border ${
              s.status === "Absen"
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">{s.class}</p>
              </div>

              <span
                className={`px-3 py-1 rounded text-sm ${
                  s.status === "Absen"
                    ? "bg-red-200 text-red-700"
                    : "bg-yellow-200 text-yellow-700"
                }`}
              >
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}