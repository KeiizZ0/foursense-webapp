import { Status } from "./absence.type";
import { ClassGrade } from "./class.type";

export type GetOneStudentRes = {
  success: boolean;
  message: string;
  data: GetOneStudentData;
};

export type GetOneStudentData = {
  id: string;
  nis: number;
  class: GetOneClassData;
  user: GetOneUserData;
  absences: GetOneAbsencesData[];
};

type GetOneClassData = {
  classes: ClassGrade;
  major: string;
};

type GetOneUserData = {
  name: string;
  email: string;
};

export type GetOneAbsencesData = {
  status: Status;
};
