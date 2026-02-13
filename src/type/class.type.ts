export type GetAllClassRes = {
  success: boolean;
  message: string;
  data: GetAllClassData;
};

export type GetAllClassData = {
  id: string;
  classes: ClassGrade;
  major: string;
  academicYear: string;
  // student: StudentData[];
  createdAt: Date;
  updatedAt: Date;
};

export enum ClassGrade {
  X = "X",
  XI = "XI",
  XII = "XII",
}
