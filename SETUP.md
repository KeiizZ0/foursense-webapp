# FourSense - Sistem Manajemen Absensi & Todo List

## Overview
FourSense adalah aplikasi manajemen kehadiran dan todo list untuk SMKN 4 Bandung dengan 3 roles berbeda: Admin, Guru, dan Siswa.

## Features Utama

### 1. Role-Based Access Control
- **Admin**: Akses ke semua fitur (Guru + Siswa)
- **Guru**: Dashboard monitoring kehadiran dan data siswa
- **Siswa**: Todo list dan absensi dengan geolocation

### 2. Todo List System
- Siswa membuat todo list sebelum dapat absensi
- Setiap todo melalui AI validation sebelum disimpan
- Tidak ada popup konfirmasi - otomatis tersimpan jika valid
- Status: Pending atau Completed

### 3. Attendance System
- Absensi hanya bisa dilakukan setelah semua todo selesai
- Tombol berubah warna:
  - Gray (Disabled): Todo belum selesai
  - Blue: Siap absen
  - Green: Sudah absen
- Geolocation tracking untuk keamanan
- Status: Hadir, Terlambat, Alpha (Absen), Izin, Sakit

### 4. Guru Dashboard
- Monitoring kehadiran per jurusan
- Filter berdasarkan: Jurusan, Kelas, Tingkat (10/11/12), Tanggal
- Edit manual status kehadiran siswa
- Statistik real-time

## Login Credentials (Demo)

```
Admin:
Email: admin@foursense.com
Password: admin123

Guru:
Email: guru@foursense.com
Password: guru123

Siswa:
Email: siswa@foursense.com
Password: siswa123
```

## API Integration

### Backend Configuration
- Base URL: `http://localhost:8000/api`
- API Key: `dnwioadnaiowndioa198198njawx`
- Framework: Laravel

### Available Endpoints

**Guru APIs:**
- GET `/api/guru/dashboard` - Dashboard overview
- GET `/api/guru/kehadiran/kelas` - Attendance per class
- GET `/api/guru/laporan/statistik` - Statistics report
- GET `/api/guru/siswa/detail` - Student detail
- GET `/api/guru/kelas/siswa` - Students in class
- GET `/api/guru/kehadiran/filter` - Filter attendance

**Siswa APIs:**
- GET `/api/siswa/dashboard` - Student dashboard
- POST `/api/siswa/todo` - Submit todo list
- POST `/api/siswa/kehadiran` - Submit attendance
- GET `/api/siswa/kehadiran/riwayat` - Attendance history
- GET `/api/siswa/todo/riwayat` - Todo history
- GET `/api/siswa/status/hari-ini` - Today's status
- PUT `/api/siswa/todo/{id}` - Update todo

## File Structure

```
app/
├── admin/               # Admin portal
│   ├── layout.tsx
│   ├── dashboard/
│   ├── guru/           # Access guru features
│   └── siswa/          # Access siswa features
├── teacher/            # Guru portal
│   ├── dashboard/
│   ├── attendance/
│   ├── students/
│   └── reports/
├── student/            # Siswa portal
│   ├── dashboard/
│   ├── todos/
│   └── attendance/
├── layout.tsx
└── page.tsx            # Login page

lib/
├── api.ts              # API utilities
└── utils.ts

hooks/
└── use-auth.ts         # Auth management

components/
├── teacher-sidebar.tsx
├── student-sidebar.tsx
└── ui/                 # shadcn components
```

## Key Features Implementation

### AI Todo Validation
```typescript
// Simulasi AI check (dapat diganti dengan AI API)
- Minimum 10 karakter
- Harus mengandung alfanumerik
- Tidak boleh kosong atau hanya spasi
```

### Geolocation Tracking
- Browser request permission untuk akses lokasi
- Latitude & Longitude disimpan dengan attendance record
- Timeout: 10 detik

### State Management
- localStorage untuk data lokal
- API calls untuk backend persistence
- useAuth hook untuk authentication

## Environment Variables

Set these in your `.env.local` file:

```env
# Server-side only (secure - not exposed to client)
BACKEND_API_URL=http://localhost:8000/api
API_KEY=dnwioadnaiowndioa198198njawx

# Client-side safe
NEXT_PUBLIC_APP_NAME=FourSense
```

**Important Security Notes:**
- `BACKEND_API_URL` dan `API_KEY` adalah server-side only
- Client tidak memiliki akses ke API key
- Semua API calls dari client di-proxy melalui Next.js API routes
- API key tersimpan aman di server

## Navigation Flow

```
Login Page (/)
├── Admin
│   └── /admin/dashboard
│       ├── /admin/guru → /teacher/*
│       └── /admin/siswa → /student/*
├── Guru
│   └── /teacher/dashboard
│       ├── /teacher/attendance
│       ├── /teacher/students
│       └── /teacher/reports
└── Siswa
    └── /student/dashboard
        ├── /student/todos
        └── /student/attendance
```

## Development Notes

1. **API Integration**: Update `NEXT_PUBLIC_API_URL` di `.env.local` sesuai backend Anda
2. **AI Validation**: Fungsi `checkTodoWithAI()` di `lib/api.ts` dapat dikustomisasi
3. **Geolocation**: Browser harus HTTPS untuk production
4. **Local Storage**: Data disinkronisasi dengan API backend

## Database Structure (Expected)

### Users Table
- id, email, password_hash, role, name, nis (for siswa), kelas (for siswa)

### Todo List Table
- id, user_id, aktivitas, tanggal, dikirim_pada, status

### Kehadiran Table
- id, user_id, tanggal, jam_masuk, status, latitude, longitude, todo_id

### Kelas Table
- id, nama_kelas, jurusan, tingkat (10/11/12)

## Troubleshooting

1. **API Connection Error**
   - Verifikasi backend sudah running
   - Check NEXT_PUBLIC_API_URL
   - Verify API_KEY

2. **Geolocation Permission**
   - Pastikan browser memberikan permission
   - HTTPS untuk production
   - Check browser console untuk detail error

3. **Todo List Not Saving**
   - Verify AI check logic
   - Check localStorage quota
   - See console untuk error messages

## Contact & Support

Untuk informasi lebih lanjut atau support, hubungi tim development.
