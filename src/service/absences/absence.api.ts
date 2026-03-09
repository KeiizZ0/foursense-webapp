"use client";

import { ApiClient } from "@/lib/helpers/base.api";
import { ShowMyAbsencesRes, ShowOneAbsencesRes } from "./absence.type";

export async function ShowMyAbsenceAPI(): Promise<ShowMyAbsencesRes> {
  const res: ShowMyAbsencesRes = await ApiClient(
    "GET",
    "/api/absen/me/attendance-summary",
  );
  return res;
}

export async function ShowAllAbsenceAPI(
  id: string,
): Promise<ShowOneAbsencesRes> {
  const res: ShowOneAbsencesRes = await ApiClient(
    "GET",
    `/api/absen/get-one/${id}`,
  );
  return res;
}

export async function ShowOneAbsenceAPI(
  id: string,
): Promise<ShowOneAbsencesRes> {
  const res: ShowOneAbsencesRes = await ApiClient(
    "GET",
    `/api/absen/get-one/${id}`,
  );
  return res;
}
