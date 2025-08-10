import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default:
      "bg-[--color-panel] text-[--color-panel-foreground] hover:bg-[--color-muted]",
    primary:
      "bg-[--color-primary] text-[--color-primary-foreground] hover:bg-[--color-primary]/90",
    secondary:
      "bg-[--color-accent] text-[--color-accent-foreground] hover:bg-[--color-accent]/80",
    danger: "bg-[--color-danger] text-white hover:bg-[--color-danger]/90",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
