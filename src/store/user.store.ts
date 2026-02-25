// zustand disini fungsinya untuk menyimpan data dan fungsi yang bisa dipanggil dimana saja,
// tanpa kelihangan data saat navigasi ke page lain,
// kecuali kalau hard restart dari browser atau mengubah url langsung dari browser

"use client"; // zustand hanya bisa dijalankan di client side

import { getOneUserAPI, showMeAPI } from "@/restApi/user.api";
import {  UserData, UserRes } from "@/type/user.type";
import { create } from "zustand";

interface AuthInterface {
  // agar fungsi atau data dari zustand store bisa dilihat dari page lain, zustand store harus didefinisikan datanya terlebih dahulu
  FetchUser: UserData[]; // karena ada [], maka dihitung sebagai array
  FetchOneUser: UserData | null; // dihitung sebagai object
  accessToken: string;
  myData: UserData | null;
  showMe: () => Promise <UserData | null>; // ini definisi untuk fungsi showMe, promise adalah pendefinisian data return
  getOne: () => Promise<UserData | null>; // ini definisi untuk fungsi showMe, promise adalah pendefinisian data return
  reset: () => void; // fungsi untuk mereset state saat logout
  
}

export const useUserStorage = create<AuthInterface>((set) => ({
  // set disini adalah "fitur" milik zustand store, fungsinya untuk menyimpan data di dalam fungsi
  FetchUser: [], // tempat penyimpanan untuk fungsi user get all
  FetchOneUser: null,
  accessToken: "",
  myData: null,

  showMe: async () => {
    try {
      const res: UserData = await showMeAPI(); // show me API adalah fungsi yang dipanggil dalam restApi/user.api.ts
      set({ myData: res });
      return res;
    } catch (error) {
      return null;
    }
  },
  getOne: async () => {
    const { myData } = useUserStorage.getState()
    try {
      const res: UserData = await getOneUserAPI(myData?.id || ""); // show me API adalah fungsi yang dipanggil dalam restApi/user.api.ts
      set({ myData: res });
      return res;
    } catch (error) {
      return null;
    }
  },
  reset: () => {
    // Fungsi untuk mereset semua state saat logout
    set({
      FetchUser: [],
      FetchOneUser: null,
      accessToken: "",
      myData: null,
    });
  },

}));
