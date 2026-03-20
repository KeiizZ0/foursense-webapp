export type Absence = {
  id: string;
  status: "PRESENT" | "ABSENT" | "SICK" | "PERMIT";
  has_todo: boolean;
  absenceAt: string;
  student: {
    user: {
      name: string;
      nis: string;
    };
    class: {
      academicYear: string;
      major: string;
      classNumber: number;
    };
  };
};

export type AbsenceResponse = {
  success: boolean;
  message: string;
  data: {
    absences: Absence[];
    page: number;
    limit: number;
  };
};
