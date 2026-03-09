"use server";

import { getCookie } from "@/lib/helpers/cookies";
import { ShowOneStudentRes } from "./students.type";

export async function ShowMeAPI(id: string) {
  const key = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/student/get-one/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const data: ShowOneStudentRes = await res.json();
  return data;
}

export async function ShowOneStudentAPI(id: string) {
  const key = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/student/get-one/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const data: ShowOneStudentRes = await res.json();

  return data;
}
