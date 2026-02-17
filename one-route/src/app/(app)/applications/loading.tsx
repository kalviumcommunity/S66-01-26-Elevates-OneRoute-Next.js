export default function ApplicationsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="px-6 py-8">
          <div className="mb-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-6 py-8">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-32"></div>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                </div>
                <div className="ml-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
