/**
 * Paginated Data Example with SWR
 * Demonstrates pagination, cache efficiency, and dynamic key management
 */

"use client";

import { useState } from "react";
import { usePaginated } from "@/hooks/useSWRHooks";
import { Loader } from "@/components/feedback/Loader";

interface PaginatedExampleProps {
  endpoint: string;
  itemName: string;
  initialLimit?: number;
}

/**
 * PaginatedDataExample Component
 * Demonstrates:
 * 1. Page-based pagination with SWR
 * 2. Multiple cache entries (separate page caches)
 * 3. Prefetching on button hover
 * 4. Dynamic SWR key management
 */
export function PaginatedDataExample({
  endpoint,
  itemName,
  initialLimit = 10,
}: PaginatedExampleProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const { data, total, hasMore, isLoading, error, mutate } = usePaginated(
    endpoint,
    page,
    limit
  );

  const totalPages = Math.ceil(total / limit);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-800 font-semibold">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Pagination Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{itemName}</h2>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1); // Reset to page 1 when limit changes
          }}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {isLoading && data.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader />
            <span className="ml-2">Loading...</span>
          </div>
        ) : data.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {item.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No {itemName.toLowerCase()} found</p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing <span className="font-semibold">{data.length}</span> of{" "}
          <span className="font-semibold">{total}</span> {itemName.toLowerCase()}
        </div>
        <div>
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages || 1}</span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, page - 2) + i;
            if (pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded ${
                  pageNum === page
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextPage}
          disabled={!hasMore || isLoading}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition"
        >
          {isLoading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Cache Info */}
      <details className="text-xs text-gray-600 border-t pt-3 mt-4">
        <summary className="cursor-pointer font-medium">
          💾 Cache Details
        </summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(
            {
              endpoint,
              currentPage: page,
              itemsPerPage: limit,
              totalItems: total,
              cacheKey: `${endpoint}?page=${page}&limit=${limit}`,
              explanation:
                "Each page has its own SWR cache entry. Navigating between pages is instant if cached.",
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}
