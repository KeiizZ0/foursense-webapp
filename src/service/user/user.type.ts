import { ClassGrade } from "../class/class.type";

export type ShowMeRes = {
  success: boolean;
  message: string;
  data: ShowMeData;
};

export type ShowMeData = {
  id: string;
  name: string;
  role: Role;
  email: string;
  slug: string;
  student: ShowMeStudentData;
  nis: string;
};

export type ShowMeStudentData = {
  id: string;
  class: ShowMeClassData;
};

export type ShowMeClassData = {
  id: string;
  classes: ClassGrade;
  major: string;
};

export enum Role {
  UNREGISTERED = "UNREGISTERED",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}
