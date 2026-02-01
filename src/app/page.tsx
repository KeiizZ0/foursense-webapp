"use client";

import { InputFloatingLabel } from "@/components/input";
import { LoginRequest } from "@/restApi/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Home() {
  const router = useRouter();
  const { refresh } = useAuthStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: { email: "", password: "" },
  });
  const login = useAuthStore((state) => state.login);
  const onSubmit: SubmitHandler<LoginRequest> = async (
    formData: LoginRequest,
  ) => {
    try {
      await login(formData);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const isAuth = async () => {
    const data = await refresh();
    if (data) router.push("/dashboard");
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-225 h-125 shadow-2xl flex gap-2.5 justify-center items-center border border-base-300 rounded-md">
        <form
          className="w-1/2 p-10 flex flex-col gap-2.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-7xl font-medium font-inter mb-5">Welcome Back</h1>
          <InputFloatingLabel
            placeholder="Username"
            type="email"
            {...register("email")}
          />
          <InputFloatingLabel
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          <a href="#" className="link mb-5">
            <s>Forgot Password?</s>
          </a>
          <button className="btn btn-primary">Log In</button>
        </form>
        <div>
          <h1 className="text-7xl font-semibold font-inter">Opat Opat</h1>
        </div>
      </div>
    </div>
  );
}
