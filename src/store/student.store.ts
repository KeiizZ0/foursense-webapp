import { GetOneStudentAPI } from "@/restApi/student.api";
import { GetOneStudentData } from "@/type/student.type";
import { create } from "zustand";

interface StudentInterface {
  FetchOneStudent: GetOneStudentData | null;
  getOne: (id: string) => Promise<GetOneStudentData | null>;
}

export const useStudentStorage = create<StudentInterface>((set) => ({
  FetchOneStudent: null,

  getOne: async (id: string) => {
    try {
      const data = await GetOneStudentAPI(id);
      set({ FetchOneStudent: data });
      return data;
    } catch (error) {
      return null;
    }
  },
}));
