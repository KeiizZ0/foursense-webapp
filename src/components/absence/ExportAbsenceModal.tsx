"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { exportAbsence } from "@/restApi/absence.api";
import { toast } from "sonner";

interface ExportAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportAbsenceModal({
  isOpen,
  onClose,
}: ExportAbsenceModalProps) {
  // Pake string aja karena input type="date" balikin format yyyy-mm-dd
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [selectedClass, setSelectedClass] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async () => {
    if (!selectedClass || !startDate || !endDate) {
      toast.error("Tolong pilih kelas dan rentang tanggal");
      return;
    }

    setIsLoading(true);
    try {
      const data = await exportAbsence(selectedClass, startDate, endDate);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Absence");

      const fileName = `Absence_${selectedClass}_${startDate}_to_${endDate}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Data berhasil di-export");
      onClose();
    } catch (error) {
      toast.error("Gagal export data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-800">Export Data Absensi</h2>
        
        <div className="space-y-4">
          {/* Select Kelas */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Pilih Kelas</label>
          </div>

          {/* Input Tanggal Manual */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dari Tanggal</label>
              <input
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sampai Tanggal</label>
              <input
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? "Downloading..." : "Download Excel"}
          </Button>
        </div>
      </div>
    </div>
  );
}