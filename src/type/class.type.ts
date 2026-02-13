import { StudentData } from "./student";

export type ClassRes = {
  success: boolean;
  message: string;
  data: ClassData;
};

export type ClassData = {
  id: string;
  classes: ClassGrade;
  major: string;
  academicYear: string;
  student: StudentData[];
  createdAt: Date;
  updatedAt: Date;
};

export enum ClassGrade {
  X,
  XI,
  XII,
}
