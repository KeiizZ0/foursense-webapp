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