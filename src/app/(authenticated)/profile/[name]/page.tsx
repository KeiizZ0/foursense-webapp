"use server"; // async harus use server

import Profile from "@/components/layout/profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // server side tidak bisa memanggil fungsi ataupun data dari zustand store
  // karena file ini terpaksa menjadi server side, 
  // kita akali dengan menggunakan component yang didalamnya berisi client side
  return <Profile name={name} />; // ctrl + klik Profile
}
