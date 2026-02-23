"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";

interface InputFloatingLabel {
  type: "text" | "email" | "password";
  size?: "sm" | "md";
  placeholder: string;
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "p-1 text-sm",
  md: "p-3",
};

const labelStyles: Record<string, string> = {
  sm: "left-1 top-1 text-sm peer-focus:text-xs peer-focus:-top-4.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-left-0.5 peer-focus:-left-0.5 peer-[:not(:placeholder-shown)]:-top-4.5",
  md: "left-3 top-3 peer-focus:text-xs peer-focus:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:left-2 peer-focus:left-2 peer-[:not(:placeholder-shown)]:-top-2",
};

export const InputFloatingLabel: React.FC<InputFloatingLabel> = ({
  type,
  size = "md",
  placeholder,
  className,
  ...rest
}) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative max-w">
      <input
        type={currentType}
        id={id}
        placeholder=" "
        className={`${sizeStyles[size]} ${className} block w-full border border-gray-300 peer rounded bg-transparent focus:border-blue-500 focus:outline-none`}
        {...rest}
      />

      <label
        htmlFor={id}
        className={`${labelStyles[size]} absolute px-1 bg-base-100 text-gray-500 transition-all cursor-text
           peer-focus:text-blue-500
          `}
      >
        {placeholder}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-0 right-0 text-sm font-medium text-accent-content hover:text-blue-500 p-3 rounded-r"
        >
          {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      )}
    </div>
  );
};
