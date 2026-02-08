"use client";

import { ApiClient } from "@/lib/helpers/axios"; // ready to use component, sebaiknya jangan diubah
import { ShowMeData, ShowMeRes } from "@/type/user.type"; // pendefinisian data disimpan disini

export async function showMeAPI(): Promise<ShowMeData> {
  // return akan mengembalikan show me data
  const res = await ApiClient.get<ShowMeRes>("/api/auth/me", {
    // perhatikan methodnya ".get", jangan sampai salah dengan yang di postman
    headers: {
      "Content-Type": "application/json", // dikirim sebagai json
      "ngrok-skip-browser-warning": "true", // karena kita pakai ngrok harus ada header ini
    },
    withCredentials: true, // untuk menggirimkan cookie dan headers
  });

  return res.data.data; // data ini nantinya akan dikirim ke zustand store user
}
