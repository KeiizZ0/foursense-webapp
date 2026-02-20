export type GetAllAbsencesRes = {
  success: boolean;
  message: string;
  data: GetAllAbsencesData;
};

export type GetAllAbsencesData = {
  id: string;
  student_id: string;
  absence_time: Date;
  status: Status;
  has_todo: string;
};

export enum Status {
  present = "present",
  onLeave = "onLeave",
  ill = "ill",
  late = "late",
  unexcused = "unexcused",
}
