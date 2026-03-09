"use server";

import { ApiClient } from "@/lib/helpers/base.api";
import { ShowMyTodoTodayRes } from "./todo.type";

export async function ShowMyTodoTodayAPI(): Promise<ShowMyTodoTodayRes> {
  const res: ShowMyTodoTodayRes = await ApiClient("GET", "/api/todos/me");
  return res;
}
