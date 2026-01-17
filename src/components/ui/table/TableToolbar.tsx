import { Search, Plus } from "lucide-react";
import { ReactNode } from "react";
import Button from "../Button";

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  onAddClick?: () => void;
  addButtonLabel?: string;
}

export default function TableToolbar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "search...",
  children,
  onAddClick,
  addButtonLabel = "Add New",
}: TableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start xl:items-center mb-6">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>

        {children}
      </div>

      {onAddClick && (
        <div className="w-full sm:w-auto">
          <Button onClick={onAddClick} className="w-full sm:w-auto gap-2">
            <Plus size={18} /> {addButtonLabel}
          </Button>
        </div>
      )}
      {/* why do we have to check if there is onAddClick? because in previous it's just button with onclick */}
    </div>
  );
}
