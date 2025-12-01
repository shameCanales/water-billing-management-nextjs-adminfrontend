import type { ChangeEvent } from "react";

type FormInputProps = {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  htmlId: string;
};

export default function FormInput({
  type,
  value,
  onChange,
  htmlId,
}: FormInputProps) {
  return (
    <input
      className="mt-2 border border-stone-400 p-3 rounded-lg focus:outline-none montserrat-medium"
      type={type}
      value={value}
      id={htmlId}
      onChange={onChange}
    />
  );
}
