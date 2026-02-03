import BillsTable from "@/components/bills/BillTable";

export default function BillsPage() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
        <p className="text-sm text-gray-500">
          Manage bills of consumer&apos;s connections
        </p>
      </div>
      <BillsTable />
    </div>
  );
}
