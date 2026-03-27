// app/actions/auth.ts
"use server";

import { getCookie, setCookie, deleteCookie } from "./cookies";
import { AuthReq, AuthRes, ChangePasswordRes } from "@/type/auth.type";

export async function login(body: AuthReq) {
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

  return { success: false, message: "Invalid email or password!" };
}


export async function refresh(refresh: string) {
  const refresh_token = await getCookie("rftkn");

  if (!refresh_token)
    return { success: false, message: "Refresh token is empty!" };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
    {
      method: "GET",
      headers: {
        "x-refresh-token": `${refresh}`,
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    },
  );

  const data: AuthRes = await res.json();

  if (data.success) {
    await setCookie("acctkn", data.data.accessToken);
    await setCookie("rftkn", data.data.refreshToken);
    return {
      success: true,
      message: "Success refresh",
      data: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      },
    };
  } else {
    await logout();
  }
}

export async function changePassword(oldPassword: string) {
  const access_token = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword }),
      cache: "no-store",
    },
  );

  const data: ChangePasswordRes = await res.json();

  if (data.success) {
    return {
      success: true,
      message: "Success refresh",
      data: {
        resetToken: data.data.resetToken,
      },
    };
  } else {
    await logout();
  }
}

export async function resetPassword(newPassword: string, reset_token: string) {
  const access_token = await getCookie("acctkn");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "X-Reset-Token": `${reset_token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
      cache: "no-store",
    },
  );

  const data: AuthRes = await res.json();

  if (data.success) {
    await setCookie("acctkn", data.data.accessToken);
    await setCookie("rftkn", data.data.refreshToken);
    return {
      success: true,
      message: "Success refresh",
      data: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      },
    };
  } else {
    await logout();
  }
}

export async function logout() {
  await deleteCookie("acctkn");
  await deleteCookie("rftkn");
  await deleteCookie("resettoken");
}
