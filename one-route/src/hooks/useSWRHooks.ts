/**
 * Custom SWR Hooks
 * Provides domain-specific SWR hooks for common data fetching scenarios
 */

import useSWR, { SWRConfiguration } from "swr";
import { fetcher, fetcherWithAuth } from "./fetcher";

// ============================================
// User Hooks
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * Hook to fetch user list
 * @param options - SWR configuration options
 */
export function useUsers(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    "/api/users",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000, // 5 minutes
      ...options,
    }
  );

  return {
    users: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook to fetch a single user by ID
 * @param userId - User ID (null to disable fetching)
 * @param options - SWR configuration options
 */
export function useUser(userId: number | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    userId ? `/api/users/${userId}` : null,
    fetcherWithAuth,
    {
      revalidateOnFocus: true,
      ...options,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Application Hooks
// ============================================

export interface Application {
  id: number;
  userId: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to fetch applications list (admin only)
 * @param options - SWR configuration options
 */
export function useApplications(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<Application[]>(
    "/api/applications",
    fetcherWithAuth,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // Auto-refresh every 30 seconds for admin
      ...options,
    }
  );

  return {
    applications: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook to fetch user's own applications
 * @param options - SWR configuration options
 */
export function useMyApplications(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<Application[]>(
    "/api/applications/my",
    fetcherWithAuth,
    {
      revalidateOnFocus: true,
      ...options,
    }
  );

  return {
    applications: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Task Hooks
// ============================================

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  assignedTo: number;
  createdAt: string;
}

/**
 * Hook to fetch tasks list
 * @param userId - Optional filter by user ID
 * @param options - SWR configuration options
 */
export function useTasks(userId?: number, options?: SWRConfiguration) {
  const key = userId ? `/api/tasks?userId=${userId}` : "/api/tasks";

  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    key,
    fetcherWithAuth,
    {
      revalidateOnFocus: true,
      refreshInterval: 10000, // Auto-refresh every 10 seconds
      ...options,
    }
  );

  return {
    tasks: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Dashboard Stats Hook
// ============================================

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  totalTasks: number;
  completedTasks: number;
  lastUpdated: string;
}

/**
 * Hook to fetch dashboard statistics
 * @param options - SWR configuration options
 */
export function useDashboardStats(options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    "/api/dashboard/stats",
    fetcherWithAuth,
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, // Auto-refresh every minute
      ...options,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// ============================================
// Pagination Hook
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Hook to fetch paginated data
 * @param endpoint - API endpoint
 * @param page - Current page number
 * @param limit - Items per page
 * @param options - SWR configuration options
 */
export function usePaginated<T>(
  endpoint: string,
  page: number = 1,
  limit: number = 10,
  options?: SWRConfiguration
) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<T>>(
    `${endpoint}?page=${page}&limit=${limit}`,
    fetcherWithAuth,
    {
      revalidateOnFocus: true,
      ...options,
    }
  );

  return {
    data: data?.data || [],
    page: data?.page || page,
    limit: data?.limit || limit,
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
