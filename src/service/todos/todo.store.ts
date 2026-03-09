"use client";

import { create } from "zustand";
import { ShowMyTodoTodayData, ShowMyTodoTodayRes } from "./todo.type";

type status = {
  success: boolean;
  message: string;
};

interface AuthInterface {
  MyTodo: ShowMyTodoTodayData[] | null;
}

export const useTodosStore = create<AuthInterface>((set) => ({
  MyTodo: null,
}));
