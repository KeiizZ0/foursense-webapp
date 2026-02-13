export type GetAllTodoRes = {
  success: boolean;
  message: string;
  data: GetAllTodoData;
};

export type GetAllTodoData = {
  id: string;
  student_id: string;
  activity: string;
  createdAt: Date;
};
