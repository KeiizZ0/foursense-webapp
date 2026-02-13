export type AbsencesRes = {
  success: boolean;
  message: string;
  data: AbsencesData;
};

export type AbsencesData = {
  id: string;
  student_id: string;
  absence_time: Date;
  status: Status;
  has_todo: string;
};

export enum Status {
  present,
  onLeave,
  ill,
  unexcused,
}
