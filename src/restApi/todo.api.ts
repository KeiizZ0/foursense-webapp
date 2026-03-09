"use server";

import { ApiClient } from "@/lib/helpers/axios";

export async function createTodo(body: {
  title: string;
  status: "Urgent" | "Normal";
  date?: string;
  done: boolean;
}) {
  try {
    const res = await ApiClient.post("/api/todos/create", {
      activity: body.title,
    });
    return res.data;
  } catch (error: any) {
    console.error("=== TODO ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Full response:", JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.message ?? "Gagal menambah tugas");
  }
}