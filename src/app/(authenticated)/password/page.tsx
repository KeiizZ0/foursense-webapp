"use client";
import { InputFloatingLabel } from "@/components/ui/input";
import { changePassword } from "@/lib/helpers/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jawa = await changePassword(value);

    if (jawa?.data?.resetToken) {
      router.push(`password/reset/${jawa.data.resetToken}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputFloatingLabel
        type="password"
        placeholder="Password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
