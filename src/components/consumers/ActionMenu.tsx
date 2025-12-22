"use client";

import { useEffect, useRef, ReactNode } from "react";
import { MoreVertical } from "lucide-react";

// --- 1. The Main Menu Shell ---
interface ActionMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: ReactNode; // Accepts the list of items
}

export const ActionMenu = ({
  isOpen,
  onToggle,
  onClose,
  children,
}: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Stop row click
          onToggle();
        }}
        className={`p-1 rounded-full transition-colors ${
          isOpen
            ? "bg-gray-100 text-gray-600"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
          {children}
        </div>
      )}
    </div>
  );
};

// --- 2. The Reusable Menu Item ---
interface ActionMenuItemProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export const ActionMenuItem = ({
  onClick,
  children,
  className = "",
}: ActionMenuItemProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Stop row click
        onClick?.();
      }}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
};
