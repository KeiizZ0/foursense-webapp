"use client";

import { login } from "@/lib/helpers/auth";
import { LoginShcema } from "@/schema/auth.schema";
import { LoginReq } from "@/type/auth.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<LoginReq>({
    resolver: yupResolver(LoginShcema),
  });

  const onSubmit: SubmitHandler<LoginReq> = async (payload: LoginReq) => {
    setLoginError("");
    const res = await login(payload);
    if (res.success) {
      router.push("/");
    } else {
      // Set error untuk username/password salah
      setLoginError(res.message || "Invalid email or password");
      // Set error untuk field email dan password
      setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
      setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background-image: url('/smk4.jpg');
          background-size: cover;
          background-position: center;
        }

        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.7),
            rgba(7, 7, 7, 0.65),
            rgba(0, 0, 0, 0.7)
          );
        }

        .glass-card {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 380px;
          padding: 32px 28px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px) saturate(1.5);
          -webkit-backdrop-filter: blur(18px) saturate(1.5);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35);
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        /* ANIMATED BORDER */
        .glass-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(
            270deg,
            #ebe0e8,
            #eda1bf
          );
          background-size: 400% 400%;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: -1;
          animation: borderMove 8s ease-in-out infinite;
          will-change: background-position;
        }

        @keyframes borderMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .login-title {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ffffff, #dcdcff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .login-subtitle {
          text-align: center;
          color: rgba(255,255,255,0.6);
          margin-bottom: 30px;
          font-size: 14px;
        }

        .field-label {
          color: rgba(255,255,255,0.8);
          font-size: 13px;
          margin-bottom: 6px;
          display: block;
        }

        /* Input dengan style error */
        .glass-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          color: white;
          outline: none;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .glass-input.error {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
        }

        .glass-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .glass-input:focus {
          border-color: rgba(100,160,255,0.8);
          box-shadow: 0 0 0 3px rgba(80,130,255,0.2);
        }

        .error-msg {
          color: #ff6b6b;
          font-size: 12px;
          margin: -12px 0 12px;
        }

        .glass-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #363380);
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.3s;
          
        }

        .glass-btn:hover {
          transform: translateY(-2px);
        }

        .forgot-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: rgba(180,210,255,0.8);
          text-decoration: none;
          font-size: 13px;
        }

        .forgot-link:hover {
          color: white;
        }

        /* PASSWORD WRAPPER - eye button style */
        .password-wrapper {
          position: relative;
          margin-bottom: 4px;
        }

        .password-wrapper .glass-input {
          margin-bottom: 0;
          padding-right: 45px;
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: white;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
          background: transparent;
          border: none;
          padding: 0;
        }

        .eye-btn:hover {
          opacity: 1;
        }

        /* Adjust spacing for error message after password */
        .password-wrapper + .error-msg {
          margin-top: 12px;
        }
      `}</style>

      <div className="login-root">
        <div className="login-bg" />
        <div className="login-bg-overlay" />

        <div className="glass-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Login to continue</p>


          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="field-label">Email</label>
            <input
              className={`glass-input ${errors.email ? "error" : ""}`}
              type="email"
              placeholder="you@gmail.com"
              {...register("email")}
            />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}

            <label className="field-label">Password</label>
            <div className="password-wrapper">
              <input
                className={`glass-input ${errors.password ? "error" : ""}`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="error-msg">{errors.password.message}</p>}

            <button className="glass-btn" type="submit">
              LOGIN
            </button>
          </form>

          <a href="/forgot-password" className="forgot-link">
            Forgot Password?
          </a>
        </div>
      </div>
    </>
  );
}