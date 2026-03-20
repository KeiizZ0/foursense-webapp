import { ApiClient } from "@/lib/helpers/axios";

function mapStatus(status: string): "Hadir" | "Terlambat" | "Alfa" {
  if (status === "ON_TIME") return "Hadir";
  if (status === "LATE") return "Terlambat";
  return "Alfa";
}

export async function checkIn() {
  try {
    const response = await ApiClient.put("/api/absen/check-in");
    console.log("CHECKIN RESPONSE:", response.data);

    const status = response.data?.data?.status;
    return {
      ...response.data,
      statusIndonesia: mapStatus(status), // ← "Hadir" / "Terlambat" / "Alfa"
    };
  } catch (error: any) {
    console.error("=== ABSEN ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Full response:", JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.message ?? "Gagal melakukan absensi");
  }
}

export async function getMyAbsences() {
  try {
    const response = await ApiClient.get("/api/absen/today");
    console.log("ABSENCE RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching absences:", error);
    return [];
  }
}

import { AbsenceResponse } from "@/type/absence.type";

export async function getClassAbsences({
  academicYear,
  major,
  classNumber,
  start,
  end,
  page = 1,
  limit = 100
}: {
  academicYear: string;
  major: string;
  classNumber: number;
  start: string;
  end: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = { page, limit, start, end, academicYear, major, classNumber: classNumber.toString() };
    const response = await ApiClient.get("/api/absen/get-all", { params });
    console.log("CLASS ABSENCES RESPONSE:", response.data);
    return response.data as AbsenceResponse;
  } catch (error: any) {
    console.error("Error fetching class absences:", error);
    throw new Error(error.response?.data?.message ?? "Failed to fetch absences");
  }
}

// NEW: For Teacher Dashboard - Get ALL absences TODAY, grouped by class
export async function getAllAbsencesNoFilter() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = today.toISOString();
    const end = tomorrow.toISOString();

    const response = await ApiClient.get("/api/absen/get-all", {
      params: { page: 1, limit: 1000, start, end }
    });

    console.log("DASHBOARD ABSENCES RESPONSE:", response.data);

    if (!response.data.success || !response.data.data?.absences) {
      return {
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalSick: 0,
        totalPermit: 0,
        averageAttendance: 0,
        byClass: {},
        alerts: []
      };
    }

    const absences = response.data.data.absences;

    const byClass: Record<string, {
      total: number;
      present: number;
      absent: number;
      late: number;
      sick: number;
      permit: number;
      students: Array<{ name: string; status: string; }>;
    }> = {};

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalSick = 0;
    let totalPermit = 0;

    absences.forEach((absence: any) => {
      const classKey = `${absence.student.class.major}-${absence.student.class.classNumber}`;
      const status = absence.status;

      if (!byClass[classKey]) {
        byClass[classKey] = { total: 0, present: 0, absent: 0, late: 0, sick: 0, permit: 0, students: [] };
      }

      byClass[classKey].total += 1;
      byClass[classKey].students.push({
        name: absence.student.user.name,
        status
      });

      switch (status) {
        case 'PRESENT':
          byClass[classKey].present += 1;
          totalPresent += 1;
          break;
        case 'LATE':
          byClass[classKey].late += 1;
          totalLate += 1;
          break;
        case 'SICK':
          byClass[classKey].sick += 1;
          totalSick += 1;
          break;
        case 'PERMIT':
          byClass[classKey].permit += 1;
          totalPermit += 1;
          break;
        case 'ABSENT':
        default:
          byClass[classKey].absent += 1;
          totalAbsent += 1;
          break;
      }
    });

    const alerts = absences
      .filter((a: any) => a.status === 'ABSENT' || a.status === 'LATE')
      .slice(0, 6)
      .map((a: any) => ({
        name: a.student.user.name,
        class: `${a.student.class.major.toUpperCase()} ${a.student.class.classNumber}`,
        status: a.status === 'ABSENT' ? 'Absen' : 'Terlambat'
      }));

    const totalStudents = totalPresent + totalAbsent + totalLate + totalSick + totalPermit;
    const averageAttendance = totalStudents > 0 ? Math.round(((totalPresent + totalLate) / totalStudents) * 100) : 0;

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      totalSick,
      totalPermit,
      averageAttendance,
      byClass,
      alerts
    };
  } catch (error: any) {
    console.error("Dashboard absences error:", error);
    return {
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalSick: 0,
      totalPermit: 0,
      averageAttendance: 0,
      byClass: {},
      alerts: []
    };
  }
}

export async function exportAbsence(
  classId: string,
  startDate: string,
  endDate: string
) {
  try {
    const response = await ApiClient.get("/api/absen/export", {
      params: { classId, startDate, endDate },
    });

    const data = response.data.data;
    const header = ["Nama Siswa", ...data.dates];
    const rows = data.students.map((student: any) => {
      const studentRow = [student.name];
      data.dates.forEach((date: any) => {
        const absence = student.absences.find((a: any) => a.date === date);
        studentRow.push(absence ? absence.status : "");
      });
      return studentRow;
    });

    return [header, ...rows];
  } catch (error: any) {
    console.error("Error exporting absences:", error);
    throw new Error(
      error.response?.data?.message ?? "Failed to export absences"
    );
  }
}
