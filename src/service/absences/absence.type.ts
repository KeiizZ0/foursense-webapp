export type ShowMyAbsencesRes = {
  success: boolean;
  message: string;
  data: ShowMyAbsencesData;
};

export type ShowMyAbsencesData = {
  _count: { status: number };
  status: Status;
};

export type ShowOneAbsencesRes = {
  success: boolean;
  message: string;
  data: ShowOneAbsencesData;
};

export type ShowOneAbsencesData = {
  id: string;
  absence_time: Status;
};

export enum Status {
  present = "present",
  onLeave = "onLeave",
  ill = "ill",
  unexcused = "unexcused",
}
