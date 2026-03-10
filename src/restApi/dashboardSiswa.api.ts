import { ApiClient } from "@/lib/helpers/axios";
import { use } from "react";

export async function getWeeklyAbsensi() {
  try {
    const res = await ApiClient.get("/api/absen/me/getWeeklyTotal");
    return res.data;
  } catch (error: any) {
    console.error("=== ABSENSI ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    throw new Error(error.response?.data?.message ?? "Gagal mengambil data absensi");
  }
}
