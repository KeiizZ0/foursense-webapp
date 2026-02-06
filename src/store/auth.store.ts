"use client";

import {
  login,
  logout,
  LoginRequest,
  refresh,
  showMe,
  ShowMeData,
} from "@/restApi/auth.api";
import { create } from "zustand";

interface AuthInterface {
  accessToken: string;
  myData: ShowMeData | null;
  login: (data: LoginRequest) => Promise<boolean>;
  refresh: () => Promise<boolean>;
  showMe: () => Promise<ShowMeData | null>;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthInterface>((set) => ({
  accessToken: "",
  myData: null,

  login: async (data: LoginRequest) => {
    set({ accessToken: "" });
    try {
      const res = await login(data);
      set({ accessToken: res.data.token });
      return true;
    } catch (error) {
      return false;
    }
  },

  refresh: async () => {
    try {
      const res = await refresh();
      set({ accessToken: res.data.token });
      return true;
    } catch (error) {
      return false;
    }
  },

  showMe: async () => {
    try {
      const res: ShowMeData = await showMe();
      set({ myData: res });
      return res;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    try {
      await logout();
      set({ accessToken: "" });
      return true;
    } catch (error) {
      return false;
    }
  },
}));
