'use client';

import { useEffect } from "react";

interface UsersErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UsersError({ error, reset }: UsersErrorProps) {
  useEffect(() => {
    console.error("Users route failed", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-8 text-center text-sm">
      <h2 className="text-lg font-semibold text-amber-900">We could not load the directory.</h2>
      <p className="text-gray-700 max-w-md">
        The user listing API needs another shot. Use the retry button to trigger a fresh fetch and
        keep this tab open until the skeleton cards resolve.
      </p>
      <button
        onClick={reset}
        className="rounded bg-amber-600 px-4 py-2 font-medium text-white shadow hover:bg-amber-700"
      >
        Retry loading
      </button>
    </div>
  );
}
