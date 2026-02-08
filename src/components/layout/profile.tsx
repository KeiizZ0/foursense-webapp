"use client";

import { useAuthStore } from "@/store/user.store";
import { useEffect } from "react";

export default function Profile(data: { name: string }) {
  const { FetchUser } = useAuthStore();
  const { name } = data;

  useEffect(() => {
    // nanti panggil api yang cari satu user spesifik dengan nama
  }, []); // dependensi "[]" jangan dihapus, nanti infinite loop

  const isExist = FetchUser.some((a) => a.name === name); // cel akun ada atau tidak
  return isExist ? ( // disebut sebagai ternary operator kondisi ? nilai jika benar : nilai jika salah
    <>tampilan kalau akun ada</>
  ) : (
    <>tampilan kalau akun tidak ada</>
  );
}
