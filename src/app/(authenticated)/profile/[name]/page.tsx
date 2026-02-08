"use server"; // async harus use server

import Profile from "@/components/layout/profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return <Profile name={name} />;
}
