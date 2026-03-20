import { z } from 'zod'

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Email harus valid (Gmail)').toLowerCase(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  nis: z.string().regex(/^\d{7}$/, 'NIS harus 7 digit').transform(val => parseInt(val, 10)),
  kelas: z.string().min(1, 'Pilih kelas')
})

export type CreateStudentInput = z.infer<typeof createStudentSchema>
