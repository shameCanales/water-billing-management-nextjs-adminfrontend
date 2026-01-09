import ConnectionsTable from "@/components/connections/ConnectionTable";

export default function ConnectionsPage() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
        <p className="text-sm text-gray-500">Manage connections of consumers</p>
      </div>
      <ConnectionsTable />
    </div>
  );
}
