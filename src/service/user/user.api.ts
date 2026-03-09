"use client";

import { getCookie } from "@/lib/helpers/cookies";
import { ShowMeRes } from "./user.type";

export async function ShowMeAPI() {
  const key = await getCookie("acctkn");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${key}`,
    },
  });

  const data: ShowMeRes = await res.json();

  if (data.success) return data;

  return { success: false, message: data.message, data: data.data };
}