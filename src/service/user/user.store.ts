"use client";

import { create } from "zustand";
import { ShowMeData, ShowMeRes } from "./user.type";
import { ShowMeAPI } from "./user.api";

type status = {
  success: boolean;
  message: string;
};

interface AuthInterface {
  ManyUser: ShowMeData[];
  OneUser: ShowMeData | null;
  MyData: ShowMeData | null;
  ShowMe: () => Promise<status>;
}

export const useUserStore = create<AuthInterface>((set) => ({
  ManyUser: [],
  OneUser: null,
  MyData: null,

  ShowMe: async () => {
    try {
      const res: ShowMeRes = await ShowMeAPI();
      set({ MyData: res.data });
      return { success: res.success, message: res.message };
    } catch (error) {
      return { success: false, message: error as string };
    }
  },
}));
