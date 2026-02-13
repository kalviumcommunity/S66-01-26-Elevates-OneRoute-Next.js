const pulseBlock = (className: string) => (
  <div className={`rounded bg-gray-200 ${className}`} />
);

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse space-y-3">
        {pulseBlock("h-4 w-24")}
        {pulseBlock("h-8 w-64")}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse space-y-3 rounded-lg bg-white p-5 shadow">
            {pulseBlock("h-4 w-24")}
            {pulseBlock("h-8 w-20")}
            {pulseBlock("h-3 w-full")}
          </div>
        ))}
      </div>

      <div className="animate-pulse space-y-4 rounded-lg bg-white p-6 shadow">
        {pulseBlock("h-5 w-48")}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            {pulseBlock("h-4 w-40")}
            {pulseBlock("h-3 w-64")}
          </div>
        ))}
      </div>
    </div>
  );
}
