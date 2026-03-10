import { ApiClient } from "@/lib/helpers/axios";

export async function getMyTodos() {
  try {
    const response = await ApiClient.get("/api/todos/me");
    console.log("RESPONSE TODO:", response.data);

    const todoList = response.data?.data?.todo_list || [];

    return todoList.map((todo: any) => ({
      id: todo.id,
      title: todo.activity,
      status: "Normal" as "Normal" | "Urgent",
      date: todo.createdAt
        ? new Date(todo.createdAt).toLocaleDateString("id-ID")
        : undefined,
      done: false,
    })).reverse();
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

export async function createTodo(activity: string) {
  try {
    const response = await ApiClient.post("/api/todos/create", {
      activity: activity,
    });

    console.log("CREATE RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating todo:", error);
    throw new Error(error.response?.data?.message ?? "Gagal menambah tugas");
  }
}