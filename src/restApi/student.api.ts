"use client";

import { ApiClient } from "@/lib/helpers/axios";
import { GetOneStudentData, GetOneStudentRes } from "@/type/student.type";

export async function GetOneStudentAPI(id: string): Promise<GetOneStudentData> {
  const res = await ApiClient.get<GetOneStudentRes>(
    `/api/student/get-one/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      withCredentials: true,
    },
  );

  return res.data.data;
}
