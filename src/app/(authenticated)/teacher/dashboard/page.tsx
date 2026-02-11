"use client";

export default function DashboardGuru() {

  // ===== DATA DUMMY =====
  const statistik = {
    hadir: 124,
    absen: 18,
    terlambat: 12,
    rata: 92,
  };

  const dataJurusan = [
    { jurusan: "RPL", total: 32, hadir: 30, absen: 2, terlambat: 0 },
    { jurusan: "TKJ", total: 30, hadir: 28, absen: 1, terlambat: 1 },
    { jurusan: "MM", total: 28, hadir: 26, absen: 2, terlambat: 0 },
    { jurusan: "AP", total: 31, hadir: 29, absen: 2, terlambat: 0 },
    { jurusan: "AKL", total: 29, hadir: 27, absen: 0, terlambat: 2 },
    { jurusan: "BDP", total: 24, hadir: 24, absen: 0, terlambat: 0 },
  ];

  const alertSiswa = [
    {
      nama: "Ahmad Wirawan",
      kelas: "RPL 1",
      status: "Absen",
    },
    {
      nama: "Siti Nurhaliza",
      kelas: "TKJ 2",
      status: "Terlambat",
    },
    {
      nama: "Budi Santoso",
      kelas: "MM 1",
      status: "Absen",
    },
    {
      nama: "Dewi Kusuma",
      kelas: "AKL 3",
      status: "Terlambat",
    },
  ];

  const persen = (hadir: number, total: number) =>
    Math.round((hadir / total) * 100);

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

        {/* Rata-rata */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between">
            <p>Rata-rata Hadir</p>
            <span className="text-blue-500">📊</span>
          </div>
          <h2 className="text-3xl font-bold">{statistik.rata}%</h2>
          <p className="text-sm text-gray-400">bulan ini</p>
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
            <tr>
              <th>Jurusan</th>
              <th>Total</th>
              <th className="text-green-600">Hadir</th>
              <th className="text-red-600">Absen</th>
              <th className="text-orange-500">Terlambat</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {dataJurusan.map((d, i) => (
              <tr key={i}>
                <td>{d.jurusan}</td>
                <td>{d.total}</td>

                <td className="text-green-600 font-medium">
                  {d.hadir}
                </td>

                <td className="text-red-600 font-medium">
                  {d.absen}
                </td>

                <td className="text-orange-500 font-medium">
                  {d.terlambat}
                </td>

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
            className={`
              mb-3 p-3 rounded-lg border
              ${
                s.status === "Absen"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{s.nama}</p>
                <p className="text-sm text-gray-500">{s.kelas}</p>
              </div>

              <span
                className={`
                  px-3 py-1 rounded text-sm
                  ${
                    s.status === "Absen"
                      ? "bg-red-200 text-red-700"
                      : "bg-yellow-200 text-yellow-700"
                  }
                `}
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
