import { ComponentProps } from "react";
import Button from "@/components/ui/Button"; // Import your main reusable Button

// Inherit all standard Button props (onClick, disabled, etc.)
type PaginationButtonProps = ComponentProps<typeof Button>;

export default function PaginationButton({
  className = "",
  children,
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      variant="outline" // Always use outline style
      size="sm" // Always use small size
      // Force square shape (w-8 h-8) and remove default padding (p-0) for icons
      className={`w-8 h-8 p-0 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
