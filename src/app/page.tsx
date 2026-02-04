// app/page.tsx
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

// Tipe untuk form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// Ganti URL ini dengan alamat backend Anda (misalnya http://localhost:3001 atau URL production)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [isSignUpActive, setIsSignUpActive] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
    try {
      console.log('📤 Mengirim request ke:', url);
      console.log('📝 Data:', JSON.parse(options.body as string));

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📥 Response raw text:', responseText.substring(0, 500));
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ Gagal parse JSON:', parseError);
        console.error('❌ Response text:', responseText);
        throw new Error(`Server mengembalikan response yang bukan JSON`);
      }
      
      return { response, data };
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setLoading(false);
      return;
    }

    try {
      // PERBAIKAN: Hapus console.log yang salah dan perbaiki sintaks
      const url = `${API_URL}/api/auth/register`;
      console.log('🔗 URL Signup:', url);
      
      const { response, data } = await fetchWithErrorHandling(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        throw new Error(data.error || 'Pendaftaran gagal');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect ke login
      setIsSignUpActive(false);
      setError('');
      alert('Pendaftaran berhasil! Silakan login.');

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // PERBAIKAN: Perbaiki sintaks fetch yang rusak
      const url = `${API_URL}/api/auth/login`;
      console.log('🔗 URL Login:', url);
      
      const { response, data } = await fetchWithErrorHandling(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Simpan token
      const accessToken = response.headers.get('X-Access-Token');
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }

      // Ambil role dari response data
      const role = data.data?.role;

      // Simpan data user dengan role yang sesuai untuk auth guard
      if (data.data) {
        const userData = {
          ...data.data,
          role: role === 'teacher' ? 'guru' : role === 'student' ? 'siswa' : role
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirect berdasarkan role
      if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (role === 'student') {
        router.push('/student/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard'); // Default untuk unregistered
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center p-5 bg-[url('/images/gedung-smkn4.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">FOURSENCE</h2>
        <div className={`w-full max-w-sm lg:max-w-md h-96 bg-white rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-600 ease-in-out`} id="container">
          {/* Sign In Form */}
          <div className={`absolute top-0 left-0 w-full h-full transition-all duration-600 ease-in-out ${isSignUpActive ? 'opacity-0 -translate-x-full pointer-events-none' : 'opacity-100 translate-x-0'}`}>
            <form onSubmit={handleLogin} className="w-full h-full bg-white flex flex-col items-center justify-center px-12 text-center">
              <h1 className="font-bold m-0 text-2xl mb-4">Masuk</h1>
              <span className="text-xs text-gray-600 mb-4 block">Gunakan akun Anda</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                required
                disabled={loading}
                className="bg-gray-100 border-0 px-4 py-3 my-2 w-10/12 rounded focus:outline-none focus:border-2 focus:border-red-500 disabled:opacity-70 text-sm"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                required
                disabled={loading}
                className="bg-gray-100 border-0 px-4 py-3 my-2 w-10/12 rounded focus:outline-none focus:border-2 focus:border-red-500 disabled:opacity-70 text-sm"
              />
              <a href="/forgot-password" className="text-blue-500 text-xs my-3 hover:text-blue-700">Lupa password?</a>
              {error && <div className="text-red-600 text-xs my-2 p-2 bg-red-100 rounded w-10/12">{error}</div>}
              <button type="submit" disabled={loading} className="w-10/12 rounded-full bg-blue-500 text-white text-xs font-bold py-2 mt-4 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition">
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
              <p className="text-xs text-gray-600 mt-4">Belum punya akun? <button type="button" onClick={() => setIsSignUpActive(true)} className="text-blue-500 font-semibold hover:underline">Daftar</button></p>
            </form>
          </div>

          {/* Sign Up Form */}
          <div className={`absolute top-0 left-0 w-full h-full transition-all duration-600 ease-in-out ${isSignUpActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
            <form onSubmit={handleSignUp} className="w-full h-full bg-white flex flex-col items-center justify-center px-12 text-center overflow-y-auto">
              <h1 className="font-bold m-0 text-2xl mb-4">Buat Akun</h1>
              <span className="text-xs text-gray-600 mb-4 block">Gunakan email untuk pendaftaran</span>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-100 border-0 px-4 py-3 my-2 w-10/12 rounded focus:outline-none focus:border-2 focus:border-red-500 disabled:opacity-70 text-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-100 border-0 px-4 py-3 my-2 w-10/12 rounded focus:outline-none focus:border-2 focus:border-red-500 disabled:opacity-70 text-sm"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-100 border-0 px-4 py-3 my-2 w-10/12 rounded focus:outline-none focus:border-2 focus:border-red-500 disabled:opacity-70 text-sm"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-100 border-0 px-4 py-3 my-2 w-10/12 rounded focus:outline-none focus:border-2 focus:border-red-500 disabled:opacity-70 text-sm"
              />
              {error && <div className="text-red-600 text-xs my-2 p-2 bg-red-100 rounded w-10/12">{error}</div>}
              <button type="submit" disabled={loading} className="w-10/12 rounded-full bg-blue-500 text-white text-xs font-bold py-2 mt-4 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition">
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
              <p className="text-xs text-gray-600 mt-4">Sudah punya akun? <button type="button" onClick={() => setIsSignUpActive(false)} className="text-blue-500 font-semibold hover:underline">Masuk</button></p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white text-xs max-w-2xl">
          <p>© 2024 SMK Negeri 4 Bandung. All rights reserved.</p>
          <p className="mt-2">
            Need help?{" "}
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Contact support
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}