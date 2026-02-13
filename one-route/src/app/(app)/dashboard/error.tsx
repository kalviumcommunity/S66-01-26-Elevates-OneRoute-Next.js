'use client';

import Link from "next/link";
import { useEffect } from "react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard route failed", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm">
      <h2 className="text-lg font-semibold text-red-700">Unable to load dashboard insights.</h2>
      <p className="text-gray-600 max-w-md">
        A temporary glitch stopped the metrics feed. Retry to pull the latest application stats
        or jump to the users directory for manual checks.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded bg-red-600 px-4 py-2 font-medium text-white shadow hover:bg-red-700"
        >
          Try again
        </button>
        <Link
          href="/users"
          className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-white"
        >
          Open users
        </Link>
      </div>
    </div>
  );
}
