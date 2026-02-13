interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  register,
  error,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        {...register(name)}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
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
