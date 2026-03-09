export type ShowMyTodoTodayRes = {
  success: boolean;
  message: string;
  data: ShowMyTodoTodayData[];
};

export type ShowMyTodoTodayData = {
  id: string;
  activity: string;
  createdAt: Date;
  student: ShowMyTodoStudentTodayData;
};

type ShowMyTodoStudentTodayData = {
  class: ShowMyTodoClassTodayData;
  user: ShowMyTodoUserTodayData;
};

type ShowMyTodoClassTodayData = {
  classes: ClassGrade;
  major: string;
  academicYear: string;
};

type ShowMyTodoUserTodayData = {
  id: string;
  name: string;
};

enum ClassGrade {
  X = "X",
  XI = "XI",
  XII = "XII",
}
