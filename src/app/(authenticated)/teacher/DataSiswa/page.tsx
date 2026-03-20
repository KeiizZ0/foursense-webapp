"use client";

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Eye } from 'lucide-react';
import { getAllUserSummaryAPI } from '@/restApi/user.api';
import type { UserSummary } from '@/type/user.type';

interface DisplaySiswa {
  nama: string;
  nisn: string;
  email: string;
}

export default function DataSiswa() {
  const [dataSiswa, setDataSiswa] = useState<DisplaySiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllUserSummaryAPI();
        console.log('Full API response object:', JSON.stringify(res, null, 2));
        
        const mappedData: DisplaySiswa[] = res.data.users
          .filter((user): user is UserSummary & { student: { nis: string } } => user.student !== null)
          .map((user) => ({
            nama: user.name,
            nisn: user.student.nis,
            email: user.email,
          }));  
        console.log('Mapped data:', mappedData);
        setDataSiswa(mappedData);
      } catch (error: any) {
        console.error('Error fetching data siswa. Full error object:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = dataSiswa.filter(siswa =>
    siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siswa.nisn.includes(searchTerm)
  );
  console.log('dataSiswa:', dataSiswa.length, 'filteredData:', filteredData.length, 'searchTerm:', searchTerm);

  if (loading) {
    return <div className="p-6 bg-gray-100 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start">
        <h1 className="text-2xl font-bold">Data Siswa</h1>
        <p className="text-gray-500">
          Kelola dan pantau data siswa di kelas Anda
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center border rounded-lg bg-white px-3 py-2">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* List Siswa */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((siswa, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              {/* Kiri */}
              <div>
                <h2 className="font-semibold text-lg">{siswa.nama}</h2>
                <p className="text-sm text-gray-500">NISN: {siswa.nisn}</p>

                <div className="flex gap-4 mt-2 text-blue-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail size={16} />
                    {siswa.email}
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">
            {dataSiswa.length === 0
              ? "Tidak ada data siswa."
              : "Tidak ada siswa yang cocok dengan pencarian."}
          </div>
        )}
      </div>
    </div>
  );
}
