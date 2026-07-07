import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({ value, onChange, placeholder, disabled, id, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className || "w-full px-4 py-3 pr-12 rounded-xl border border-border bg-surface-input text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral transition-all duration-200"}
        autoComplete="off"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-coral transition-colors disabled:opacity-50"
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        tabIndex={0}
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};
