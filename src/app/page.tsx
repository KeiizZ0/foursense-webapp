"use client";

import { InputFloatingLabel } from "@/components/input";
import { login } from "@/lib/helpers/auth";
import { useAuthStore } from "@/store/user.store";
import { LoginReq } from "@/type/auth";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Home() {
  const { showMe } = useAuthStore();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginReq>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginReq> = async (payload: LoginReq) => {
    const res = await login(payload);
    if (res.success) {
      showMe();
      router.push("/");
    }
  };

  return (
    <div className="w-screen h-screen bg-base-100 overflow-x-hidden p-10">
      <img
        src="/school.png"
        alt="School"
        className="rounded-2xl h-50 w-100 object-cover"
      />
      <div className="mt-2.5 flex flex-col gap-2.5">
        <h1 className="text-3xl font-medium font-inter">Welcome Back</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident
          veniam.
        </p>
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
          {/* <p className="text-red-500">{hint}</p> */}
          <button className="btn btn-link btn-info w-fit p-0">
            Forgot Password?
          </button>
          <button className="btn btn-primary" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
