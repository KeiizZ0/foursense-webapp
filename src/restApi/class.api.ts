"use client";

import { ApiClient } from "@/lib/helpers/axios";
import type { ClassStudentsResponse } from "@/type/class.type";

export async function getClassStudents({
  academicYear,
  major,
  classNumber,
  page = 1,
limit = 40
}: {
  academicYear: string;
  major: string;
  classNumber: number;
  page?: number;
  limit?: number;
}) {
  try {
    const params = { 
      page, 
      limit, 
      academicYear, 
      major, 
      classNumber: classNumber.toString() 
    };
    const response = await ApiClient.get<ClassStudentsResponse>("/api/user/get-all", { params });
    console.log("CLASS STUDENTS RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching class students:", error);
    throw new Error(error.response?.data?.message ?? "Failed to fetch class students");
  }
}



