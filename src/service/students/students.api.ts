"use server";

import { ApiClient } from "@/lib/helpers/base.api";
import { ShowOneStudentRes } from "./students.type";

export async function ShowOneStudentAPI(
  id: string,
): Promise<ShowOneStudentRes> {
  const res: ShowOneStudentRes = await ApiClient(
    "GET",
    `/api/student/get-one/${id}`,
  );
  return res;
}
