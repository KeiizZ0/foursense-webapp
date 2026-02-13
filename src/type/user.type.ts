import { StudentData } from "./student";

export type UserRes = {
  success: boolean;
  message: string;
  data: UserData;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  student: StudentData;
};

export enum Role {
  unregistered,
  student,
  teacher,
  admin,
}

export type studentClasses = {
  nis:number
  absences: absences[]
}

export type absences = {
  date: Date
  absence_time: Date
  status: Status
  has_todo: boolean
}

enum Status {
  present,
  onLeave,
  ill,
  unexcused
}