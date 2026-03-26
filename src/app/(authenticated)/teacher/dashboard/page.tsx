"use client";

import { useState, useEffect } from 'react';
import { getAllAbsencesNoFilter } from '@/restApi/absence.api';
import type { DashboardData } from '@/type/dashboard.type';
import { Loader2, AlertCircle, Users, UserX, Clock, Heart, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

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

  const cardColors = {
    hadir: 'from-green-50 to-emerald-50 border-green-100',
    absen: 'from-red-50 to-rose-50 border-red-100',
    terlambat: 'from-yellow-50 to-amber-50 border-yellow-100',
    sakit: 'from-purple-50 to-violet-50 border-purple-100',
    tingkatKehadiran: 'from-pink-50 to-rose-50 border-pink-100',
  };

  return (
    <div className="p-6 bg-blue-900/10 rounded-2xl min-h-screen ">
      {/* Header */}
      <div className="dashboard-stat-card mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Monitoring</h1>
        <p className="text-gray-500 mt-1">Pantau kehadiran siswa SMKN 4 Bandung</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid md:grid-cols-5 gap-5 mb-6">
        {/* Hadir Card */}
        <div className={`dashboard-stat-card bg-gradient-to-br ${cardColors.hadir} rounded-2xl shadow-sm border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Hari Ini</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{statistik.hadir}</h2>
          <p className="text-sm text-gray-600 mt-1">Siswa Hadir</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+{Math.round((statistik.hadir / (statistik.hadir + statistik.absen)) * 100)}% kehadiran</span>
          </div>
        </div>

        {/* Alpha/Absen Card */}
        <div className={`dashboard-stat-card bg-gradient-to-br ${cardColors.absen} rounded-2xl shadow-sm border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Hari Ini</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{statistik.absen}</h2>
          <p className="text-sm text-gray-600 mt-1">Siswa Alpha</p>
          <div className="mt-3 h-1 w-full bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(statistik.absen / (statistik.hadir + statistik.absen)) * 100}%` }}></div>
          </div>
        </div>

        {/* Terlambat Card */}
        <div className={`dashboard-stat-card bg-gradient-to-br ${cardColors.terlambat} rounded-2xl shadow-sm border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Hari Ini</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{statistik.terlambat}</h2>
          <p className="text-sm text-gray-600 mt-1">Siswa Terlambat</p>
        </div>

        {/* Sakit Card */}
        <div className={`dashboard-stat-card bg-gradient-to-br ${cardColors.sakit} rounded-2xl shadow-sm border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Hari Ini</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{statistik.sakit}</h2>
          <p className="text-sm text-gray-600 mt-1">Siswa Sakit</p>
        </div>

        {/* Tingkat Kehadiran Card - PINK */}
        <div className={`dashboard-stat-card bg-gradient-to-br ${cardColors.tingkatKehadiran} rounded-2xl shadow-sm border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-pink-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-xs font-medium text-pink-600 bg-pink-100 px-2 py-1 rounded-full">Hari Ini</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{statistik.rata}%</h2>
          <p className="text-sm text-gray-600 mt-1">Tingkat Kehadiran</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${statistik.rata}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">target 100%</span>
          </div>
        </div>
      </div>

      {/* Tabel Jurusan */}
      <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-lg text-gray-800">Ringkasan Kehadiran Per Jurusan</h2>
        <p className="text-gray-600/70 text-sm mb-5">Data kehadiran hari ini untuk semua jurusan</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="py-3 text-sm font-semibold text-gray-600">Jurusan</th>
                <th className="py-3 text-sm font-semibold text-gray-600">Total</th>
                <th className="py-3 text-sm font-semibold text-emerald-600">Hadir</th>
                <th className="py-3 text-sm font-semibold text-rose-600">Absen</th>
                <th className="py-3 text-sm font-semibold text-amber-600">Terlambat</th>
                <th className="py-3 text-sm font-semibold text-gray-600">% Kehadiran</th>
                </tr>
            </thead>
            <tbody>
              {dataJurusan.map((d, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-medium text-gray-800">{d.jurusan}</td>
                  <td className="py-3 text-gray-600">{d.total}</td>
                  <td className="py-3 text-emerald-600 font-medium">{d.hadir}</td>
                  <td className="py-3 text-rose-600 font-medium">{d.absen}</td>
                  <td className="py-3 text-amber-600 font-medium">{d.terlambat}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${persen(d.hadir, d.total)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-[45px]">{persen(d.hadir, d.total)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Siswa */}
      <div className="dashboard-stat-card bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <h2 className="font-semibold text-lg text-gray-800">Alert - Siswa Absen dan Terlambat</h2>
        </div>
        <p className="text-gray-400 text-sm mb-5">Siswa yang tidak hadir atau terlambat hari ini</p>
        
        <div className="grid gap-3">
          {alertSiswa.map((s, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                s.status === 'Absen'
                  ? 'bg-rose-50/50 border-rose-100 hover:bg-rose-50'
                  : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{s.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.class}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    s.status === 'Absen'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {s.status === 'Absen' ? '❌ Absen' : '⏰ Terlambat'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {alertSiswa.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-gray-500">Semua siswa hadir tepat waktu! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}