"use client";

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
          We encountered an error while loading your applications. Please try again.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
            <p className="text-sm text-red-600 dark:text-red-400 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-medium rounded-lg transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
