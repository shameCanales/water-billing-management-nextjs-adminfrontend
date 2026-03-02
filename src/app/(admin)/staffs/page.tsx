import ProcessorTable from "@/components/processors/ProcessorTable";

export default function Staffs() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Staffs</h1>
        <p className="text-sm text-gray-500">
          Manage staff accounts and information
        </p>
      </div>
      <ProcessorTable />
    </div>
  );
}
