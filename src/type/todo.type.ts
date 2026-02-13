export type TodoRes = {
  success: boolean;
  message: string;
  data: TodoData;
};

export type TodoData = {
  id: string;
  student_id: string;
  activity: string;
  createdAt: Date;
};
