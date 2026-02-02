// app/page.tsx
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

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

      // Simpan token dan data user jika backend mengirimkannya
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Login berhasil, redirect ke dashboard
      router.push('/dashboard');
      router.refresh();

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
      <div className="container">
        <h2>FOURSENCE</h2>
        <div className={`container-main ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
          {/* Sign Up Form */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUp}>
              <h1>Buat Akun</h1>
              <span>Gunakan email untuk pendaftaran</span>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
              <h1>Masuk</h1>
              <span>Gunakan akun Anda</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                required
                disabled={loading}
              />
              <a href="/forgot-password">Lupa password?</a>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Selamat Datang Kembali!</h1>
                <div className="logo-container">
                  <img
                    src="/images/logo smk.png"
                    alt="SMK Negeri 4 Bandung"
                    className="school-logo"
                  />
                </div>

                <p>Masuk dengan akun yang terdaftar pada sistem kami!
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => setIsSignUpActive(false)}
                  disabled={loading}
                >
                  Masuk
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Belum Punya Akun?</h1>
                <div className="logo-container">
                  <img
                    src="/images/logo smk.png"
                    alt="SMK Negeri 4 Bandung"
                    className="school-logo"
                  />
                </div>
                <p>Masukkan detail pribadi anda, pastikan data benar!</p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={() => setIsSignUpActive(true)}
                  disabled={loading}
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-grey-500 text-sm">
          <p>© 2024 SMK Negeri 4 Bandung. All rights reserved.</p>
          <p className="mt-1">
            Need help?{" "}
            <a href="#" className="text-white-600 hover:text-blue-800">
              Contact support
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}