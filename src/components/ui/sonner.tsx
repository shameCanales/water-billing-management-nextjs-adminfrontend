"use client";

import {
  CheckCircle2,
  Info,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        style: {
          // Apple-style translucency
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",

          // The "Specular Highlight" border
          border: "1px solid rgba(255, 255, 255, 0.5)",

          // Softer, more expansive shadow
          boxShadow:
            "0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 0 1px 0 rgba(0, 0, 0, 0.1)",

          borderRadius: "14px", // Apple uses slightly larger radii
          padding: "12px 16px",
          color: "#1d1d1f", // Apple standard text color
          fontSize: "14px",
          fontWeight: "500",
        },
        // Ensures the description/message follows the same aesthetic
        descriptionClassName:
          "text-[#515154] text-[13px] font-normal leading-relaxed",
      }}
      icons={{
        // Using slightly more refined icons/colors
        success: <CheckCircle2 className="size-[18px] text-[#28cd41]" />,
        info: <Info className="size-[18px] text-[#007aff]" />,
        warning: <AlertTriangle className="size-[18px] text-[#ff9f0a]" />,
        error: <AlertCircle className="size-[18px] text-[#ff3b30]" />,
        loading: (
          <Loader2 className="size-[18px] animate-spin text-[#8e8e93]" />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
