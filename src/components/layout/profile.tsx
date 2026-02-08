"use client";

import { useUserStorage } from "@/store/user.store";
import { useEffect } from "react";

export default function Profile(data: { name: string }) {
  const { FetchUser } = useUserStorage();
  const { name } = data;

  useEffect(() => {
    // useEffect bakal ngejalanin fungsi di dalamnya, bisa dilakukan berulang kali dengan menambahkan dependensi di bagian "[]"
    // nanti panggil api yang cari satu user spesifik dengan nama
  }, []); // dependensi atau "[]" jangan dihapus, nanti infinite loop

  const isExist = FetchUser.some((a) => a.name === name); // cel akun ada atau tidak
  return isExist ? ( // disebut sebagai ternary operator kondisi ? nilai jika benar : nilai jika salah
    <>tampilan kalau akun ada</>
  ) : (
    <>tampilan kalau akun tidak ada</> // karena belum ada fungsi untuk menyimpan 
  );
}
