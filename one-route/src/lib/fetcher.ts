/**
 * SWR Fetcher Helper
 * Provides a reusable fetcher function for SWR data fetching
 * Handles authentication tokens and error responses
 */

export interface FetcherError extends Error {
  status?: number;
  statusText?: string;
}

/**
 * Basic fetcher for SWR
 * Throws an error if the HTTP status is not 2xx
 *
 * @param url - URL to fetch from
 * @returns Parsed JSON response
 * @throws FetcherError if the response is not ok
 */
export const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url, {
    credentials: "include", // Include cookies for authenticated requests
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = new Error("Failed to fetch data") as FetcherError;
    error.status = res.status;
    error.statusText = res.statusText;

    try {
      const errorData = await res.json();
      error.message = errorData.message || errorData.error || res.statusText;
    } catch {
      // Response wasn't JSON, use status text
    }

    throw error;
  }

  try {
    return res.json();
  } catch (error) {
    throw new Error("Failed to parse response JSON");
  }
};

/**
 * Authenticated fetcher for protected endpoints
 * Includes JWT token from localStorage if available
 *
 * @param url - URL to fetch from
 * @returns Parsed JSON response
 */
export const fetcherWithAuth = async (url: string): Promise<any> => {
  let token: string | null = null;

  // Try to get token from localStorage (client-side only)
  if (typeof window !== "undefined") {
    try {
      const authStore = JSON.parse(localStorage.getItem("authStore") || "{}");
      token = authStore.accessToken;
    } catch (error) {
      console.warn("Failed to retrieve token from localStorage");
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    const error = new Error("Failed to fetch data") as FetcherError;
    error.status = res.status;
    error.statusText = res.statusText;

    // If 401, token might be expired
    if (res.status === 401) {
      error.message = "Unauthorized - please login again";
      if (typeof window !== "undefined") {
        localStorage.removeItem("authStore");
      }
    }

    try {
      const errorData = await res.json();
      error.message = errorData.message || errorData.error || res.statusText;
    } catch {
      // Response wasn't JSON, use status text
    }

    throw error;
  }

  try {
    return res.json();
  } catch (error) {
    throw new Error("Failed to parse response JSON");
  }
};

/**
 * POST request wrapper for mutations
 * Used with SWR's mutate for optimistic updates
 *
 * @param url - Endpoint URL
 * @param body - Request body object
 * @returns Parsed JSON response
 */
export const mutationFetcher = async (
  url: string,
  { arg: body }: { arg: any }
): Promise<any> => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = new Error("Mutation failed") as FetcherError;
    error.status = res.status;

    try {
      const errorData = await res.json();
      error.message = errorData.message || res.statusText;
    } catch {
      error.message = res.statusText;
    }

    throw error;
  }

  return res.json();
};
