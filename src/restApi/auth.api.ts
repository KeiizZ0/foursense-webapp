"use client";

import { ApiClient } from "./base.api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  message: string;
  data: {
    token: string;
  };
};

export type ShowMeResponse = {
  status: boolean;
  message: string;
  data: ShowMeData;
};

export type ShowMeData = {
  id: string;
  name: string;
  email: string;
  role: "unregistered" | "student" | "teacher" | "admin";
};

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await ApiClient.post<LoginResponse>(
    "/api/auth/login",
    credentials,
    {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      withCredentials: true,
    },
  );

  const accessToken = res.headers["x-access-token"];

  return {
    ...res.data,
    data: { token: accessToken },
  };
}

export async function refresh(): Promise<LoginResponse> {
  const res = await ApiClient.get<LoginResponse>("/api/auth/refresh", {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });

  const accessToken = res.headers["x-access-token"];

  return {
    ...res.data,
    data: { token: accessToken },
  };
}

export async function showMe(): Promise<ShowMeData> {
  const res = await ApiClient.get<ShowMeResponse>("/api/auth/me", {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  return res.data.data;
}

export async function logout(): Promise<boolean> {
  await ApiClient.get("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });
  return true;
}
