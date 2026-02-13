'use client';

import Link from "next/link";
import { useEffect } from "react";

interface UserProfileErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UserProfileError({ error, reset }: UserProfileErrorProps) {
  useEffect(() => {
    console.error("User profile route failed", error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-8 text-sm">
      <h2 className="text-lg font-semibold text-blue-900">Profile unavailable right now.</h2>
      <p className="text-gray-700">
        The detailed user record did not load. Retry this panel or jump back to the directory and try a
        different profile while we stabilize this request.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={reset}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
        >
          Try profile again
        </button>
        <Link
          href="/users"
          className="rounded border border-blue-200 px-4 py-2 font-medium text-blue-700 hover:bg-white"
        >
          Back to users
        </Link>
      </div>
    </div>
  );
}
