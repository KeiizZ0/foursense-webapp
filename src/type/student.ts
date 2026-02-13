import { AbsencesData } from "./absence.type";
import { TodoData } from "./todo.type";

export type StudentRes = {
  success: boolean;
  message: string;
  data: StudentData;
};

export type StudentData = {
  id: string;
  user_id: string;
  class_id: string;
  nis: number;
  absences: AbsencesData[];
  todos: TodoData[];
};
