
import type { ReactNode } from "react";

type FormLabelProps = {
  children: ReactNode;
  htmlFor: string;
};

export default function FormLabel({children, htmlFor}: FormLabelProps){
  return <label htmlFor={htmlFor}>{children}</label>
}