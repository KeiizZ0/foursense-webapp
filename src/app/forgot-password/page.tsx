"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, KeyRound, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

type Step = "old-password" | "new-password" | "success";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("old-password");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isValidPassword = newPassword.length >= 8 && passwordsMatch;

  // Step 1: change-password → dapat resetToken
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ oldPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Password salah. Coba lagi.");
        return;
      }

      // Simpan resetToken ke cookie
      const resetToken = data.token ?? data.resetToken ?? data.data?.token;
      if (!resetToken) {
        setError("Token tidak ditemukan dari server.");
        return;
      }
      document.cookie = `resetToken=${resetToken}; path=/; max-age=300`; // expires 5 menit

      setStep("new-password");
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: reset-password → pakai resetToken dari cookie
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword) return;

    setLoading(true);
    setError(null);

    try {
      // Ambil resetToken dari cookie
      const resetToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("resetToken="))
        ?.split("=")[1];

      if (!resetToken) {
        setError("Session habis. Ulangi dari awal.");
        setStep("old-password");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "X-Reset-Token": resetToken,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }

      // Hapus cookie resetToken
      document.cookie = "resetToken=; path=/; max-age=0";

      setStep("success");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  // ===== SUCCESS =====
  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl w-full max-w-sm p-8 flex flex-col items-center gap-4 text-center">
          <CheckCircle2 className="w-16 h-16 text-success" />
          <h2 className="text-xl font-bold">Password Berhasil Diubah!</h2>
          <p className="text-sm text-base-content/60">
            Kamu akan diarahkan ke halaman login...
          </p>
          <span className="loading loading-dots loading-md text-success" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body gap-5">

          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 p-3 rounded-full">
              {step === "old-password"
                ? <Lock className="w-7 h-7 text-primary" />
                : <KeyRound className="w-7 h-7 text-primary" />
              }
            </div>
            <h1 className="text-2xl font-bold">Ganti Password</h1>
            <p className="text-sm text-base-content/60">
              {step === "old-password"
                ? "Masukkan password lama kamu"
                : "Buat password baru kamu"}
            </p>
          </div>

          {/* Step indicator */}
          <ul className="steps w-full text-xs">
            <li className={`step ${step === "old-password" || step === "new-password" ? "step-primary" : ""}`}>
              Verifikasi
            </li>
            <li className={`step ${step === "new-password" ? "step-primary" : ""}`}>
              Password Baru
            </li>
          </ul>

          {/* Error */}
          {error && (
            <div className="alert alert-error py-2 text-sm flex gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ===== STEP 1: OLD PASSWORD ===== */}
          {step === "old-password" && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <PasswordField
                label="Password Lama"
                placeholder="Masukkan password lama"
                value={oldPassword}
                show={showOld}
                onToggle={() => setShowOld((v) => !v)}
                onChange={setOldPassword}
                autoFocus
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!oldPassword || loading}
              >
                {loading
                  ? <span className="loading loading-spinner loading-sm" />
                  : "Lanjutkan"
                }
              </button>

              <p className="text-center text-xs text-base-content/50">
                Ingat password?{" "}
                <a href="/login" className="link link-primary font-medium">Login</a>
              </p>
            </form>
          )}

          {/* ===== STEP 2: NEW PASSWORD ===== */}
          {step === "new-password" && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <PasswordField
                label="Password Baru"
                hint="Min. 8 karakter"
                placeholder="Minimal 8 karakter"
                value={newPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                onChange={setNewPassword}
                minLength={8}
                autoFocus
              />
              <PasswordField
                label="Konfirmasi Password Baru"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                onChange={setConfirmPassword}
                match={confirmPassword.length > 0 ? passwordsMatch : undefined}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-ghost px-3"
                  onClick={() => {
                    setError(null);
                    setNewPassword("");
                    setConfirmPassword("");
                    setStep("old-password");
                  }}
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={!isValidPassword || loading}
                >
                  {loading
                    ? <span className="loading loading-spinner loading-sm" />
                    : "Simpan Password"
                  }
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// ===== Reusable Password Field =====
function PasswordField({
  label,
  hint,
  placeholder,
  value,
  show,
  onToggle,
  onChange,
  minLength,
  match,
  autoFocus,
}: {
  label: string;
  hint?: string;
  placeholder: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  minLength?: number;
  match?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-medium">{label}</span>
        {hint && <span className="label-text-alt text-base-content/50">{hint}</span>}
        {match !== undefined && (
          <span className={`label-text-alt font-medium ${match ? "text-success" : "text-error"}`}>
            {match ? "Cocok ✓" : "Tidak cocok"}
          </span>
        )}
      </div>
      <div
        className={`input input-bordered flex items-center gap-2 pr-2 ${
          match !== undefined ? (match ? "input-success" : "input-error") : ""
        }`}
      >
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="grow bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={minLength}
          autoFocus={autoFocus}
        />
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle"
          onClick={onToggle}
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}