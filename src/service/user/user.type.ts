import { ClassGrade } from "../class/class.type";

export type ShowMeRes = {
  success: boolean;
  message: string;
  data: ShowMeData;
};

export type ShowMeData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  student: ShowMeStudentData;
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
  UNREGISTERED,
  STUDENT,
  TEACHER,
  ADMIN,
}
