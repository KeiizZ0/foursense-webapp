import { StudentData } from "./student";

export type UserRes = {
  success: boolean;
  message: string;
  data: ShowMeData;
};

export type ShowMeData = {
  id: string;
  name: string;
  email: string;
  role: "unregistered" | "student" | "teacher" | "admin";
  student: StudentData;
};
