import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center bg-white p-8 rounded-lg shadow">
        <p className="text-sm font-medium text-indigo-600 mb-2">
          InternLink
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          404 — Page Not Found
        </h1>

        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
          Don’t worry — your internship journey is still on track.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
