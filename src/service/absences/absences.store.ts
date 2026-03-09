"use client";

import { create } from "zustand";
import { ShowMyAbsencesData, ShowMyAbsencesRes, ShowOneAbsencesData, ShowOneAbsencesRes } from "./absence.type";
import { ShowMyAbsenceAPI, ShowOneAbsenceAPI } from "./absence.api";

type status = {
  success: boolean;
  message: string;
};

interface AuthInterface {
  OneAbsence: ShowOneAbsencesData | null
  MyAbsences: ShowMyAbsencesData | null;
  ShowMyAbsences: () => Promise<status>;
  ShowOneAbsences: (id: string) => Promise<status>;
}

export const useAbsenceStore = create<AuthInterface>((set) => ({
  OneAbsence: null,
  MyAbsences: null,

  ShowMyAbsences: async () => {
    try {
      const res: ShowMyAbsencesRes = await ShowMyAbsenceAPI();
      set({ MyAbsences: res.data });
      return { success: res.success, message: res.message };
    } catch (error) {
      return { success: false, message: error as string };
    }
  },

  ShowOneAbsences: async (id: string) => {
    try {
      const res: ShowOneAbsencesRes = await ShowOneAbsenceAPI(id);
      set({ OneAbsence: res.data });
      return { success: res.success, message: res.message };
    } catch (error) {
      return { success: false, message: error as string };
    }
  },
}));
