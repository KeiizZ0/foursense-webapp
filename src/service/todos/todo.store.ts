"use client";

import { create } from "zustand";
import { ShowMyTodoTodayData, ShowMyTodoTodayRes } from "./todo.type";
import { ShowMyTodoTodayAPI } from "./todo.api";

type status = {
  success: boolean;
  message: string;
};

interface AuthInterface {
  MyTodo: ShowMyTodoTodayData[] | null;
  ShowMyTodoToday: () => Promise<status>;
}

export const useTodosStore = create<AuthInterface>((set) => ({
  MyTodo: null,

  ShowMyTodoToday: async () => {
    try {
      const res: ShowMyTodoTodayRes = await ShowMyTodoTodayAPI();
      set({ MyTodo: res.data });
      return { success: res.success, message: res.message };
    } catch (error) {
      return { success: false, message: error as string };
    }
  },
}));
