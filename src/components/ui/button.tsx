
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  onClick?: () => void;
}

export const Button = ({ children, className, variant = "default", onClick }: ButtonProps) => {
  const baseStyle =
    "px-4 py-2 rounded-lg focus:outline-none transition duration-200";

  const variantStyle =
    variant === "outline"
      ? "border-2 border-gray-500 text-gray-500 hover:bg-gray-100"
      : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};
