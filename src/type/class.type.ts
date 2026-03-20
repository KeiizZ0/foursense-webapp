import type { UserSummary } from './user.type'

export type { UserSummary }

export type ClassStudentsResponse = {
  success: boolean
  message: string
  data: {
    students: UserSummary[]
    page: number
    limit: number
  }
}

export type UserSummaryWithStudent = UserSummary & {
  student: {
    nis: string
  }
}


