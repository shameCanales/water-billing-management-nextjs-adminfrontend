import { ComponentProps } from "react";

type FormInputProps = ComponentProps<"input">;

export default function FormInput({
  className = "",
  ...props
}: FormInputProps) {
  return (
    <input
      className={`mt-2 w-full border border-slate-200 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
