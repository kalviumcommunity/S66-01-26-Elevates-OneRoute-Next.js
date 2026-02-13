const Line = ({ className }: { className: string }) => (
  <div className={`rounded bg-gray-200 ${className}`} />
);

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <Line className="h-3 w-24" />
        <Line className="h-8 w-48" />
      </div>

      <ul className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <li key={index} className="animate-pulse space-y-3 rounded-lg bg-white p-5 shadow">
            <Line className="h-5 w-40" />
            <Line className="h-4 w-64" />
          </li>
        ))}
      </ul>
    </div>
  );
}
