import { ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { Loader } from "rsuite";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  to?: string;
  variant?:
    | "primary"
    | "primary-light"
    | "secondary"
    | "tertiary"
    | "link"
    | "transparent";
  size?: "small" | "medium" | "large" | "xlarge";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const Button = ({
  className = "",
  children,
  to,
  size = "medium",
  variant = "primary",
  type = "button",
  loading = false,
  ...props
}: ButtonProps) => {
  const sizeClass = {
    small: "text-xs px-3 h-[40px]",
    medium: "text-base px-4 h-[42px]",
    large: "text-lg px-6 h-[56px]",
    xlarge: "text-xl px-8 h-[72px]",
  }[size];

  const variantClass = {
    primary:
      "border-primary !text-white hover:bg-primary/90 active:hover:bg-primary-dark",
    "primary-light":
      "border-primary/10 text-primary hover:bg-primary/20 active:hover:bg-primary/20",
    secondary:
      "border-secondary hover:bg-secondary/90 active:hover:bg-secondary-dark",
    tertiary:
      "border-tertiary !text-white hover:bg-tertiary/90 active:hover:bg-tertiary-dark",
    link: "border-transparent hover:text-primary active:hover:text-primary-dark",
    transparent: "",
  }[variant];

  const bgClass = {
    primary: "bg-[#013A44]",
    "primary-light": "bg-primary/10",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
    link: "",
    transparent: "",
  }[variant];

  return (
    <>
      {to && !props.disabled ? (
        <Link
          to={to}
          className={`${bgClass} ${sizeClass} ${variantClass} ${className} overflow-hidden relative flex items-center justify-center leading-[1.5] transition-all`}
        >
          {loading && (
            <span
              className={`${bgClass} absolute w-full h-full flex items-center justify-center`}
            >
              <Loader />
            </span>
          )}
          {children}
        </Link>
      ) : (
        <button
          className={`${bgClass} ${sizeClass} ${variantClass} ${className} border overflow-hidden relative inline-flex items-center justify-center leading-[1.5] transition-all`}
          type={type}
          {...props}
        >
          {loading && (
            <span
              className={`${bgClass} absolute w-full h-full flex items-center justify-center`}
            >
              <Loader />
            </span>
          )}
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
