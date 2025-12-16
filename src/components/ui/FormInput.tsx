import type { ChangeEvent } from "react";

type FormInputProps = {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  htmlId: string;
  placeholder: string;
};

export default function FormInput({
  type,
  value,
  onChange,
  htmlId,
  placeholder,
}: FormInputProps) {
  return (
    <input
      className="mt-2 border border-slate-200 bg-stone-100 p-3 rounded-lg focus:outline-none text-sm"
      type={type}
      value={value}
      id={htmlId}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  );
}
