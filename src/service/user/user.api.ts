"use server";

import { ShowMeRes } from "./user.type";

export async function ShowMeAPI() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  const data: ShowMeRes = await res.json();

  if (data.success) return data;

  return { success: false, message: data.message, data: data.data };
}
