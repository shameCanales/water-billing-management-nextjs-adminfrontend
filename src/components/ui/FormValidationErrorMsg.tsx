export default function FormValidationErrorMsg({
  error,
}: {
  error: string | undefined;
}) {
  if (!error) return null;

  return <p className="text-xs text-red-500">{error}</p>;
}
