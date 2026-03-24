"use client";

import { InputFloatingLabel } from "@/components/ui/input";
import { login } from "@/lib/helpers/auth";
import { LoginShcema } from "@/schema/auth.schema";
import { AuthReq } from "@/type/auth.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Home() {
  const [hint, isHint] = useState<string | undefined>(undefined);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthReq>({
    resolver: yupResolver(LoginShcema),
  });

  const onSubmit: SubmitHandler<AuthReq> = async (payload: AuthReq) => {
    const res = await login(payload);
    if (res.success) {
      router.push("/");
    }
  };

  return (
    <div className="bg-base-100 overflow-x-hidden p-3 grid 2lg:flex 2lg:w-screen 2lg:h-screen 2lg:p-1">
      <img
        src="/school.png"
        alt="Vercel logomark"
        className="max-sm:h-30 max-lg:h-75 max-lg:w-full max-lg:rounded-2xl object-cover w-1/2"
      />
      <div className="flex flex-col gap-2.5 p-2 lg:p-10 lg:w-screen xl:w-full xl:p-30 justify-center">
        <h1 className="text-3xl font-black font-inter">Welcome Back</h1>
        <p className="font-inter mb-3">Please log in to your account</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2.5"
        >
          <InputFloatingLabel
            placeholder="Username"
            type="email"
            {...register("email")}
            onClick={() => isHint(undefined)}
          />
          <p className="max-sm:text-xs text-red-500">{errors.email?.message}</p>
          <InputFloatingLabel
            placeholder="Password"
            type="password"
            {...register("password")}
            onClick={() => isHint(undefined)}
          />
          <p className="max-sm:text-xs text-red-500">
            {errors.password?.message}
            {hint}
          </p>
          <button
            className="btn btn-neutral"
            type="submit"
            onClick={() => isHint(undefined)}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
