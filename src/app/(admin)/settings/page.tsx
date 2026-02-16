import BillingConfiguration from "@/components/settings/BillingConfiguration";

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500">
        Configure system settings and billing parameters
      </p>

      <BillingConfiguration />
    </div>
  );
}
