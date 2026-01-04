"use client";

import { Toaster as Sonner } from "sonner";

export function ToastProvider() {
  return (
    <Sonner
      position="bottom-center"
      richColors // Automatically styles success (green) and error (red)
      closeButton // Adds a close X button
      theme="light" // Can be "system", "light", or "dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-500",
          actionButton:
            "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
        },
        duration: 4000, // Default duration for all toasts
      }}
    />
  );
}
