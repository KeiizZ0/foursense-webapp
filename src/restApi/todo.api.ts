import { ApiClient } from "@/lib/helpers/axios";

export async function getMyTodos() {
  try {
    const response = await ApiClient.get("/api/todos/me");
    console.log("RESPONSE TODO:", response.data);

    const todoList = response.data?.data || [];

    const todayStr = new Date().toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return todoList
      .filter((todo: any) => {
        const checkDate = todo.deadline || todo.createdAt;
        const todoStr = new Date(checkDate).toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return todoStr === todayStr;
      })
      .map((todo: any) => ({
        id: todo.id,
        title: todo.activity,
        description: todo.description ?? "",
        date: todo.deadline
          ? new Date(todo.deadline).toLocaleDateString("id-ID")
          : todo.createdAt
          ? new Date(todo.createdAt).toLocaleDateString("id-ID")
          : undefined,
        deadlineISO: todo.deadline ?? "",
        done: todo.done ?? false,
      }))
      .reverse();
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

export async function createTodo(activity: string, deadline?: string) {
  try {
    const response = await ApiClient.post("/api/todos/create", {
      activity,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    });
    console.log("CREATE RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating todo:", error);
    throw new Error(error.response?.data?.message ?? "Gagal menambah tugas");
  }
}

export async function updateTodo(
  id: string,
  data: { activity: string; description?: string; deadline?: string }
) {
  try {
    const response = await ApiClient.put(`/api/todos/update/${id}`, {
      activity: data.activity,
      description: data.description ?? "",
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
    });
    console.log("UPDATE RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating todo:", error);
    throw new Error(error.response?.data?.message ?? "Gagal mengupdate tugas");
  }
}

export async function markAsDone(id: string) {
  try {
    const response = await ApiClient.patch(`/api/todos/markAsDone/${id}`);
    console.log("MARK AS DONE RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error marking todo as done:", error);
    throw new Error(error.response?.data?.message ?? "Gagal update status tugas");
  }
}

export async function deleteTodo(id: string) {
  try {
    const response = await ApiClient.delete(`/api/todos/delete/${id}`);
    console.log("DELETE RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting todo:", error);
    throw new Error(error.response?.data?.message ?? "Gagal menghapus tugas");
  }
}