"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | undefined> {
  return (await cookies()).get(name)?.value;
}

export async function setCookie(
  name: string,
  value: string,
  options?: Partial<{
    maxAge: number;
    path: string;
  }>,
) {
  (await cookies()).set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: options?.path ?? "/",
    maxAge: options?.maxAge ?? 60 * 15,
  });
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}
