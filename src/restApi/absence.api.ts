"use server";

import { ApiClient } from "@/lib/helpers/axios";

export async function checkIn() {
  try {
    const res = await ApiClient.put("/api/absen/check-in");
    return res.data;
  } catch (error: any) {
    console.error("=== ABSEN ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Full response:", JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.message ?? "Gagal melakukan absensi");
  }
}