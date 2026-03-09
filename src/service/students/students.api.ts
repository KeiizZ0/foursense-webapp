"use server";

import { ShowOneStudentRes } from "./students.type";

export async function ShowMeAPI(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/student/get-one/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  const data: ShowOneStudentRes = await res.json();
  return data;
}

export async function ShowOneStudentAPI(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/student/get-one/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  const data: ShowOneStudentRes = await res.json();

  return data;
}
