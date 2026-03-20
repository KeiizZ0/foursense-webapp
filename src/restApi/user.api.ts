"use client";

import { ApiClient } from "@/lib/helpers/axios"; // ready to use component, sebaiknya jangan diubah
import { UserData, UserRes, AllUsersRes } from "@/type/user.type"; // pendefinisian data disimpan disini

export async function showMeAPI(): Promise<UserData> {
  // return akan mengembalikan show me data
  const res = await ApiClient.get<UserRes>("/api/user/me", {
    // perhatikan methodnya ".get", jangan sampai salah dengan yang di postman
    headers: {
      "Content-Type": "application/json", // dikirim sebagai json
      "ngrok-skip-browser-warning": "true", // karena kita pakai ngrok harus ada header ini
    },
    withCredentials: true, // untuk menggirimkan cookie dan headers
  });

  return res.data.data // data ini nantinya akan dikirim ke zustand store user
}

export async function getOneUserAPI(id: string) {
  const res = await ApiClient.get<UserRes> (`api/user/get-one/${id}`, {
    headers: {
      "Content-Type": "applicantion/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });
  return res.data.data;
}

export async function createStudentAPI(data: { name: string; email: string; password: string; nis: number; kelas: string }) {
  const res = await ApiClient.post('/api/user/student', data, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });
  return res.data;
}

export async function getAllUserSummaryAPI(): Promise<AllUsersRes> {
  const res = await ApiClient.get<AllUsersRes>("/api/user/get-all", {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });
  return res.data;
}
