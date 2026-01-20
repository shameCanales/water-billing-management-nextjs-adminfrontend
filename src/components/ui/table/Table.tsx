import * as React from "react";

// 1. Table Container (The white card wrapper)
const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // ✅ No overflow-hidden here! This allows dropdowns/popovers to escape the container.
    className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col ${className}`}
    {...props}
  />
));
TableContainer.displayName = "TableContainer";

// 2. Scroll Area (Wraps ONLY the desktop table)
const TableScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`hidden md:block overflow-x-auto w-full ${className}`}
    {...props}
  />
));
TableScrollArea.displayName = "TableScrollArea";

// 3. The Table Element
const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={`w-full text-left border-collapse ${className}`}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={`bg-gray-50 border-b border-gray-200 ${className}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={`divide-y divide-gray-100 ${className}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`hover:bg-gray-50 transition-colors ${className}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none ${className}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`px-6 py-4 text-sm text-gray-700 whitespace-nowrap ${className}`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// 4. Loading Skeleton
const TableSkeleton = () => (
  <div className="p-8 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
    ))}
  </div>
);

// 5. Mobile List Wrapper
const TableMobileList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`md:hidden divide-y divide-gray-100 ${className}`}
    {...props}
  />
));
TableMobileList.displayName = "TableMobileList";

export {
  TableContainer,
  TableScrollArea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  TableMobileList,
};
