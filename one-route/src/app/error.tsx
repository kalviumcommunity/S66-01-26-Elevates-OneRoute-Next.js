'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-rose-400/40 bg-slate-900/70 p-10 text-center shadow-2xl shadow-rose-900/40">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-200">Recovery mode</p>
        <h1 className="mt-4 text-3xl font-semibold">Something went sideways.</h1>
        <p className="mt-3 text-slate-300">
          {error.message || 'Unknown error'}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Remove <span className="text-rose-200">?simulateError=1</span> to exit the forced failure.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="w-full rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/70"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
