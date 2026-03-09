"use client";

import { ShowMyAbsencesRes, ShowOneAbsencesRes } from "./absence.type";

export async function ShowMyAbsenceAPI() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/absen/me/getWeeklyTotal`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  const data: ShowMyAbsencesRes = await res.json();

  return data
}

export async function ShowAllAbsenceAPI() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/absen/get-all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  const data: ShowOneAbsencesRes = await res.json();

  return data
}

export async function ShowOneAbsenceAPI(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/absen/get-one/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  const data: ShowOneAbsencesRes = await res.json();

  return data
}
