import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";

interface InputFloatingLabel {
  type: "text" | "email" | "password";
  placeholder: string;
}

export const InputFloatingLabel: React.FC<InputFloatingLabel> = ({
  type,
  placeholder,
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
        className="block w-full border border-gray-300 peer p-3 rounded bg-transparent focus:border-blue-500 focus:outline-none"
        {...rest}
      />

      <label
        htmlFor={id}
        className="absolute left-3 top-3 px-1 bg-base-100 text-gray-500 transition-all cursor-text
          peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-blue-500
          peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs"
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
