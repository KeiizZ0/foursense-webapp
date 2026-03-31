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
  role: "unregistered" | "student" | "teacher" | "admin";
  email: string;
  slug: string;
  nis?: string;
  kelas?: string;
  student?: {
    id: string;
    nis: string;
    class: {
      id: string;
      academicYear: string;
      major: string;
      classNumber: number;
    };
  };
  studentClasses: studentClasses;
};

export type studentClasses = {
  nis: number;
  absences: absences[];
};

export type absences = {
  date: Date;
  absence_time: Date;
  status: Status;
  has_todo: boolean;
};

enum Status {
  present,
  onLeave,
  ill,
  unexcused,
}

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  student: {
    nis: string;
  } | null;
};

export type AllUsersRes = {
  success: boolean;
  message: string;
  data: {
    users: UserSummary[];
    page: number;
    limit: number;
  };
};

export type StudentSummary = {
  id: string;
  nis: string;
  class: {
    academicYear: string;
    major: string;
    classNumber: number;
  };
  user: {
    name: string;
    email: string;
  };
};

export type StudentListResponse = {
  success: boolean;
  message: string;
  data: {
    students: StudentSummary[];
    page: number;
    limit: number;
  };
};
