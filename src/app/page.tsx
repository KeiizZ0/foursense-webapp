"use client";

import { InputFloatingLabel } from "@/components/ui/input";
import { login } from "@/lib/helpers/auth";
import { LoginShcema } from "@/schema/auth.schema";
import { LoginReq } from "@/type/auth.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Home() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginReq>({
    resolver: yupResolver(LoginShcema),
  });

  const onSubmit: SubmitHandler<LoginReq> = async (payload: LoginReq) => {
    const res = await login(payload);
    if (res.success) {
      router.push("/");
    }
  };

  return (
    <div className="bg-base-100 overflow-x-hidden p-3 grid xl:flex xl:w-screen xl:h-screen xl:p-1">
      <img
        src="/school.png"
        alt="School"
        className="max-sm:h-30 max-lg:h-75 max-lg:w-full max-lg:rounded-2xl object-cover w-1/2"
      />
      <div className="flex flex-col gap-2.5 p-2 lg:p-10 lg:w-screen xl:w-full xl:p-30">
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
          />
          <InputFloatingLabel
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          <div>
            <p className="max-sm:text-xs text-red-500">
              {errors.email?.message}
            </p>
            <p className="max-sm:text-xs text-red-500">
              {errors.password?.message}
            </p>
          </div>

          <button className="btn btn-neutral" type="submit">
            Log In
          </button>
        </form>
        <a href="/forgot-password" className="mt-3 link">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}
