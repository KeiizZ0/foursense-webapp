"use client";

import { create } from "zustand";
import { ShowOneStudentData, ShowOneStudentRes } from "./students.type";
import { ShowOneStudentAPI } from "./students.api";

type status = {
  success: boolean;
  message: string;
};

interface AuthInterface {
  OneStudents: ShowOneStudentData | null;
  ShowOneStudents: (id: string) => Promise<status>;
}

export const useStudentsStore = create<AuthInterface>((set) => ({
  OneStudents: null,

  ShowOneStudents: async (id: string) => {
    try {
      const res: ShowOneStudentRes = await ShowOneStudentAPI(id);
      set({ OneStudents: res.data });
      return { success: res.success, message: res.message };
    } catch (error) {
      return { success: false, message: error as string };
    }
  },
}));
