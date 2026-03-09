"use server";

import { ShowMeRes } from "./user.type";

export async function ShowMeAPI(): Promise<ShowMeRes> {
  const res: ShowMeRes = await ApiClient("GET", "/api/user/me");
  return res;
}
