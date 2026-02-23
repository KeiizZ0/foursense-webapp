// zustand disini fungsinya untuk menyimpan data dan fungsi yang bisa dipanggil dimana saja,
// tanpa kelihangan data saat navigasi ke page lain,
// kecuali kalau hard restart dari browser atau mengubah url langsung dari browser

"use client"; // zustand hanya bisa dijalankan di client side

import { GetOneUserAPI, ShowMeAPI } from "@/restApi/user.api";
import {
  GetAllUserData,
  GetOneUserData,
  ShowMeUserData,
} from "@/type/user.type";
import { create } from "zustand";

interface UsersInterface {
  // agar fungsi atau data dari zustand store bisa dilihat dari page lain, zustand store harus didefinisikan datanya terlebih dahulu
  FetchUser: GetAllUserData[]; // karena ada [], maka dihitung sebagai array
  FetchOneUser: GetOneUserData | null; // dihitung sebagai object
  myData: ShowMeUserData | null;
  showMe: () => Promise<ShowMeUserData | null>; // ini definisi untuk fungsi showMe, promise adalah pendefinisian data return
  getOne: () => Promise<GetOneUserData | null>; // ini definisi untuk fungsi showMe, promise adalah pendefinisian data return
}

export const useUserStorage = create<UsersInterface>((set) => ({
  // set disini adalah "fitur" milik zustand store, fungsinya untuk menyimpan data di dalam fungsi
  FetchUser: [], // tempat penyimpanan untuk fungsi user get all
  FetchOneUser: null,
  accessToken: "",
  myData: null,

  showMe: async () => {
    try {
      const res: ShowMeUserData = await ShowMeAPI(); // show me API adalah fungsi yang dipanggil dalam restApi/user.api.ts
      set({ myData: res });
      return res;
    } catch (error) {
      return null;
    }
  },
  getOne: async () => {
    const { myData } = useUserStorage.getState();
    try {
      const res: GetOneUserData = await GetOneUserAPI(myData?.id || ""); // show me API adalah fungsi yang dipanggil dalam restApi/user.api.ts
      set({ FetchOneUser: res });
      return res;
    } catch (error) {
      return null;
    }
  },
}));
