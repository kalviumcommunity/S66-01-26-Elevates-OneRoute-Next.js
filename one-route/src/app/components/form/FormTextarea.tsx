interface FormTextareaProps {
  label: string;
  name: string;
  register: any;
  error?: string;
  rows?: number;
  placeholder?: string;
}

export default function FormTextarea({
  label,
  name,
  register,
  error,
  rows = 4,
  placeholder,
}: FormTextareaProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
