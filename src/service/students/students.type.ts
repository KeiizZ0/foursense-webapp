import { Status } from "../absences/absence.type";

export type ShowOneStudentRes = {
  success: boolean;
  message: string;
  data: ShowOneStudentData;
};

export type ShowOneStudentData = {
  id: string;
  nis: Status;
  class: ShowOneClassData;
  user: ShowOneUserData;
  absences: ShowOneAbsencesData[];
};

type ShowOneClassData = {
  status: string;
  absence_time: Status;
};

type ShowOneUserData = {
  status: string;
  absence_time: Status;
};

type ShowOneAbsencesData = {
  status: string;
  absence_time: Status;
};