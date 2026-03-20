export interface DashboardData {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalSick: number;
  totalPermit: number;
  averageAttendance: number;
  byClass: Record<string, {
    total: number;
    present: number;
    absent: number;
    sick: number;
    permit: number;
    late: number;
    students: Array<{
      name: string;
      status: string;
    }>;
  }>;
  alerts: Array<{
    name: string;
    class: string;
    status: string;
  }>;
}

