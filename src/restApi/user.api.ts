"use client";

import { ApiClient } from "@/lib/helpers/axios";
import { ShowMeData, ShowMeRes } from "@/type/user";

export async function showMe(): Promise<ShowMeData> {
  const res = await ApiClient.get<ShowMeRes>("/api/auth/me", {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });

  return res.data.data;
}
