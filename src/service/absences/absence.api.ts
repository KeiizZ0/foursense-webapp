"use client";

import { getCookie } from "@/lib/helpers/cookies";
import { ShowMyAbsencesRes, ShowOneAbsencesRes } from "./absence.type";

export async function ShowMyAbsenceAPI() {
  const key = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/absen/me/getWeeklyTotal`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const data: ShowMyAbsencesRes = await res.json();

  return data;
}

export async function ShowAllAbsenceAPI() {
  const key = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/absen/get-all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const data: ShowOneAbsencesRes = await res.json();

  return data;
}

export async function ShowOneAbsenceAPI(id: string) {
  const key = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/absen/get-one/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const data: ShowOneAbsencesRes = await res.json();

  return data;
}
