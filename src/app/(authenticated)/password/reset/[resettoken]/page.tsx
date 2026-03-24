"use client";
import { InputFloatingLabel } from "@/components/ui/input";
import { resetPassword } from "@/lib/helpers/auth";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function Page({ params }: { params: Promise<{ resettoken: string }> }) {
  const resetToken = use(params);
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jawa = await resetPassword(value, resetToken.resettoken);

    if (jawa?.success) {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputFloatingLabel
        type="password"
        placeholder="Password"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
