interface PaginationInfoProps {
  currentCount: number;
  totalCount: number;
  label?: string; // Optional: "results", "users", "items"
}

export default function PaginationInfo({
  currentCount,
  totalCount,
  label = "results",
}: PaginationInfoProps) {
  return (
    <p className="text-sm text-gray-500">
      Showing <span className="font-medium">{currentCount}</span> of{" "}
      <span className="font-medium">{totalCount}</span> {label}
    </p>
  );
}
