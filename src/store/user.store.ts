"use client";

import { showMe } from "@/restApi/user.api";
import { ShowMeData } from "@/type/user";
import { create } from "zustand";

interface AuthInterface {
  hint: string;
  accessToken: string;
  myData: ShowMeData | null;
  showMe: () => Promise<ShowMeData | null>;
}

export const useAuthStore = create<AuthInterface>((set) => ({
  hint: "",
  accessToken: "",
  myData: null,

  showMe: async () => {
    try {
      const res: ShowMeData = await showMe();
      set({ myData: res });
      return res;
    } catch (error) {
      return null;
    }
  },
}));
