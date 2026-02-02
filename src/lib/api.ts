const PROXY_URL = '/api/proxy'

export interface ApiResponse<T> {
  status: 'success' | 'error'
  message: string
  data?: T
  kode_error?: string
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const method = options.method || 'GET'
    const body = options.body ? JSON.parse(options.body as string) : null

    // Extract search params from endpoint if any
    const [path, queryString] = endpoint.split('?')
    const searchParams: Record<string, string> = {}

    if (queryString) {
      const params = new URLSearchParams(queryString)
      params.forEach((value, key) => {
        searchParams[key] = value
      })
    }

    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: path,
        method,
        body,
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'An error occurred',
        kode_error: data.kode_error,
      }
    }

    return data
  } catch (error) {
    console.error('[v0] API Error:', error)
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Guru APIs
export async function getGuruDashboard(tanggal?: string) {
  const query = tanggal ? `?tanggal=${tanggal}` : ''
  return apiCall(`/guru/dashboard${query}`)
}

export async function getKehadiranKelas(
  kelasId: number,
  tanggal: string,
  status?: string
) {
  const query = `?kelas_id=${kelasId}&tanggal=${tanggal}${status ? `&status=${status}` : ''}`
  return apiCall(`/guru/kehadiran/kelas${query}`)
}

export async function getLaporanStatistik(
  kelasId: number,
  bulan: number,
  tahun: number
) {
  return apiCall(
    `/guru/laporan/statistik?kelas_id=${kelasId}&bulan=${bulan}&tahun=${tahun}`
  )
}

export async function getSiswaDetail(siswaId?: number, nis?: string) {
  const query = siswaId
    ? `?siswa_id=${siswaId}`
    : nis
      ? `?nis=${nis}`
      : ''
  return apiCall(`/guru/siswa/detail${query}`)
}

export async function getKelasSiswa(kelasId: number) {
  return apiCall(`/guru/kelas/siswa?kelas_id=${kelasId}`)
}

export async function getKehadiranFilter(
  kelasId: number,
  tanggalMulai: string,
  tanggalAkhir: string,
  status?: string
) {
  const query = `?kelas_id=${kelasId}&tanggal_mulai=${tanggalMulai}&tanggal_akhir=${tanggalAkhir}${status ? `&status=${status}` : ''}`
  return apiCall(`/guru/kehadiran/filter${query}`)
}

// Siswa APIs
export async function getSiswaDashboard() {
  return apiCall('/siswa/dashboard')
}

export async function submitTodo(aktivitas: string, tanggal: string) {
  return apiCall('/siswa/todo', {
    method: 'POST',
    body: JSON.stringify({ aktivitas, tanggal }),
  })
}

export async function submitKehadiran(
  tanggal: string,
  jamMasuk: string,
  status: string,
  latitude?: number,
  longitude?: number
) {
  return apiCall('/siswa/kehadiran', {
    method: 'POST',
    body: JSON.stringify({
      tanggal,
      jam_masuk: jamMasuk,
      status,
      latitude,
      longitude,
    }),
  })
}

export async function getRiwayatAbsensi(bulan: number, tahun: number) {
  return apiCall(`/siswa/kehadiran/riwayat?bulan=${bulan}&tahun=${tahun}`)
}

export async function getRiwayatTodo(limit = 10, offset = 0) {
  return apiCall(`/siswa/todo/riwayat?limit=${limit}&offset=${offset}`)
}

export async function getStatusHariIni() {
  return apiCall('/siswa/status/hari-ini')
}

export async function updateTodo(id: number, aktivitas: string) {
  return apiCall(`/siswa/todo/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ aktivitas }),
  })
}

// AI Check function
export async function checkTodoWithAI(aktivitas: string): Promise<boolean> {
  try {
    // Simulasi AI check - dalam production, ini akan memanggil endpoint AI
    // Untuk sekarang, kita bisa menambahkan validasi sederhana
    const isValid =
      aktivitas.length >= 10 &&
      /[a-zA-Z0-9]{5,}/.test(aktivitas) &&
      aktivitas.trim().length > 0

    return isValid
  } catch (error) {
    console.error('[v0] AI Check Error:', error)
    return false
  }
}
