
import type { ReactNode } from "react";

type FormLabelProps = {
  children: ReactNode;
  htmlFor: string;
};

export default function FormLabel({children, htmlFor}: FormLabelProps){
  return <label className="text-sm text-slate-900" htmlFor={htmlFor}>{children}</label>
}