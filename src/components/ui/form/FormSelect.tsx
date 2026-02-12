import { ComponentProps } from "react";

type FormSelectProps = ComponentProps<"select">;

export default function FormSelect({
  className = "",
  children,
  ...props
}: FormSelectProps) {
  return (
    <select
      className={`w-full border border-slate-200 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
