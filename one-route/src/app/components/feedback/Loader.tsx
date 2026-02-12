export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-sm text-gray-600"
    >
      <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      {label}
    </div>
  );
}
