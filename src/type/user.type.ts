import { ClassGrade } from "./class.type";
import {} from "./student.type";

export type ShowMeRes = {
  success: boolean;
  message: string;
  data: ShowMeUserData;
};

export type ShowMeUserData = {
  id: string;
  name: string;
  role: Role;
  email: string;
  student: ShowMeStudentData;
};

type ShowMeStudentData = {
  id: string;
  class: ShowMeClassData;
};

type ShowMeClassData = {
  id: string;
  classes: ClassGrade;
  major: string;
};

export type GetAllUserRes = {
  success: boolean;
  message: string;
  data: GetAllUserData;
};

export type GetAllUserData = {
  id: string;
  name: string;
  role: Role;
  email: string;
  student: GetAllStudentData;
};

export type GetAllStudentData = {
  nis: number;
};

export type GetOneUserRes = {
  success: boolean;
  message: string;
  data: GetOneUserData;
};

export type GetOneUserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  student: GetOneStudentData;
};

export type GetOneStudentData = {
  nis: number;
};

export enum Role {
  unregistered,
  student,
  teacher,
  admin,
}
