"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookie, setCookie } from "../../lib/helpers/cookies";
import { AuthRes } from "./auth.type";

export async function Login(body: { email: string; password: string }) {
  if (!body) {
    return { success: false, message: "Insert email and password!" };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(body), // Email & Password
  });

  const data: AuthRes = await res.json();

  if (data.success) {
    await setCookie("acctkn", data.data.accessToken);
    await setCookie("rftkn", data.data.refreshToken);
    return { success: true, message: "" };
  }

  return { success: false, message: data.message };
}

export async function RefreshToken(refresh: string) {
  const refresh_token = await getCookie("rftkn");

  if (!refresh_token)
    return { success: false, message: "Refresh token is empty!" };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
    {
      method: "GET",
      headers: {
        Cookie: `rftkn=${refresh}`,
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    },
  );

  const data: AuthRes = await res.json();

  if (data.success) {
    await setCookie("acctkn", data.data.accessToken);
    await setCookie("rftkn", data.data.refreshToken, {
      maxAge: 60 * 60 * 24 * 14,
    });
    return {
      success: true,
      message: "Success refresh",
      data: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      },
    };
  } else {
    await Logout();
  }
}

export async function Logout() {
  const cookieStore = await cookies();
  cookieStore.delete("acctkn");
  cookieStore.delete("rftkn");
  redirect("/");
}
