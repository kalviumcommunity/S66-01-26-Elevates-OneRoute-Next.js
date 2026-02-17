/**
 * Example SWR Components - Best Practices
 * Demonstrates optimistic updates, error handling, and caching
 */

"use client";

import { useUsers, User } from "@/hooks/useSWRHooks";
import { Loader } from "@/components/feedback/Loader";
import { useState } from "react";

interface UserListProps {
  showAddForm?: boolean;
}

/**
 * UsersListExample Component
 * Demonstrates:
 * 1. Basic SWR data fetching
 * 2. Loading and error states
 * 3. Data caching and revalidation
 * 4. Optimistic UI updates
 */
export function UsersListExample({ showAddForm = false }: UserListProps) {
  const { users, isLoading, error, mutate } = useUsers();
  const [isAdding, setIsAdding] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const handleAddUser = async () => {
    if (!newUserName.trim()) return;

    setIsAdding(true);

    try {
      // Optimistic update: update UI immediately
      const optimisticUser: User = {
        id: Date.now(),
        name: newUserName,
        email: "new@example.com",
        role: "STUDENT",
        createdAt: new Date().toISOString(),
      };

      // Update cache with optimistic data (false = don't revalidate yet)
      mutate(users ? [...users, optimisticUser] : [optimisticUser], false);

      // Send API request
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: `user-${Date.now()}@example.com`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      // Clear input
      setNewUserName("");

      // Revalidate data to get the real response from server
      await mutate();
    } catch (error) {
      console.error("Error adding user:", error);
      // Revalidate to revert optimistic update on error
      mutate();
    } finally {
      setIsAdding(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Failed to load users</h3>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
        <button
          onClick={() => mutate()}
          className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <span className="text-gray-500 text-sm">
          {users?.length || 0} total
        </span>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              disabled={isAdding}
            />
            <button
              onClick={handleAddUser}
              disabled={isAdding || !newUserName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding..." : "Add User"}
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      {users && users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No users found</p>
        </div>
      )}

      {/* Cache Debug Info */}
      <details className="text-xs text-gray-600 border-t pt-3 mt-4">
        <summary className="cursor-pointer font-medium">
          💾 Cache Info (Debug)
        </summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(
            {
              dataCount: users?.length,
              lastFetch: new Date().toLocaleTimeString(),
              cacheKey: "/api/users",
              note: "SWR caches this data and revalidates on focus",
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}

/**
 * UserDetailExample Component
 * Demonstrates:
 * 1. Dynamic SWR keys (pausing fetch when ID not ready)
 * 2. Individual resource updates
 */
export function UserDetailExample({ userId }: { userId: number | null }) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Dynamically fetch only when userId is available
  const { user, isLoading, error, mutate: mutateUser } = useUsers()[0];

  if (!userId) {
    return <p className="text-gray-600">Select a user to view details</p>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader />
        <span>Loading user...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-800">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <p className="text-lg font-semibold">{user?.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Role</label>
          <p className="text-lg">{user?.role}</p>
        </div>

        <button
          onClick={() => mutateUser()}
          disabled={isUpdating}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Refresh Data"}
        </button>
      </div>
    </div>
  );
}
