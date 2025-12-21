"use client";

import { useEffect, useRef } from "react";
import { MoreVertical, Eye, Edit, UserX, Trash2 } from "lucide-react";

interface ActionMenuProps {
  isOpen: boolean; // Parent tells us: "Are we open?"
  onToggle: () => void; // We tell Parent: "User clicked the button!"
  onClose: () => void; // We tell Parent: "User clicked outside!"
}

export const ActionMenu = ({ isOpen, onToggle, onClose }: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If menu is open AND click is outside our component
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]); // Dependencies ensure fresh closures

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent row clicks if you have them
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Eye size={14} /> View Details
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Edit size={14} /> Edit Consumer
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <UserX size={14} /> Suspend Account
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
            <Trash2 size={14} /> Delete Consumer
          </button>
        </div>
      )}
    </div>
  );
};
