"use client";

import { ApiClient } from "@/lib/helpers/axios"; // ready to use component, sebaiknya jangan diubah
import { GetOneUserRes, ShowMeRes, ShowMeUserData } from "@/type/user.type"; // pendefinisian data disimpan disini

export async function ShowMeAPI(): Promise<ShowMeUserData> {
  // return akan mengembalikan show me data
  const res = await ApiClient.get<ShowMeRes>("/api/user/me", {
    // perhatikan methodnya ".get", jangan sampai salah dengan yang di postman
    headers: {
      "Content-Type": "application/json", // dikirim sebagai json
      "ngrok-skip-browser-warning": "true", // karena kita pakai ngrok harus ada header ini
    },
    withCredentials: true, // untuk menggirimkan cookie dan headers
  });

  return res.data.data; // data ini nantinya akan dikirim ke zustand store user
}

export async function GetOneUserAPI(id: string) {
  const res = await ApiClient.get<GetOneUserRes>(`api/user/get-one/${id}`, {
    headers: {
      "Content-Type": "applicantion/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });
  return res.data.data;
}
