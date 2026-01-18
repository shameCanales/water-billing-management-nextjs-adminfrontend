interface PaginationPageCounterProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationPageCounter({
  currentPage,
  totalPages,
}: PaginationPageCounterProps) {
  return (
    <span className="text-sm font-medium px-2 text-gray-700 min-w-[80px] text-center">
      Page {currentPage} of {totalPages || 1}
    </span>
  );
}
