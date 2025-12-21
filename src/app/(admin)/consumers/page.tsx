import ConsumerTable from "@/components/ConsumerTable";

export default function ConsumersPage() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Consumers</h1>
        <p className="text-sm text-gray-500">
          Manage consumer accounts and information
        </p>
      </div>
      <ConsumerTable />
    </div>
  );
}
