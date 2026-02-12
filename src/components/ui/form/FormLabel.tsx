import { ComponentProps } from "react";

// Best Practice: Inherit all standard label props (htmlFor, id, className, children, etc.)
type FormLabelProps = ComponentProps<"label">;

export default function FormLabel({
  children,
  className = "",
  ...props
}: FormLabelProps) {
  return (
    <label
      // Merge default styles with any custom className passed in
      className={`block text-sm mb-2 font-medium text-slate-900 ${className}`}
      {...props} // Spreads htmlFor and any other standard props automatically
    >
      {children}
    </label>
  );
}
