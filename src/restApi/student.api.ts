import { ApiClient } from "@/lib/helpers/axios";
import type { StudentListResponse } from "@/type/user.type";

export async function getAllStudents({
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
    const response = await ApiClient.get<StudentListResponse>("/api/student/get-all", { params });
    console.log("STUDENT LIST RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching students:", error);
    throw new Error(error.response?.data?.message ?? "Failed to fetch students");
  }
}

