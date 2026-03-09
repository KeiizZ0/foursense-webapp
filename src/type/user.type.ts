export type UserRes = {
  success: boolean;
  message: string;
  data: UserData;
};

export enum Role {
  UNREGISTERED = "UNREGISTERED",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: "unregistered" | "student" | "teacher" | "admin";
  nis?: string;
  kelas?: string;
  studentClasses: studentClasses
};

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