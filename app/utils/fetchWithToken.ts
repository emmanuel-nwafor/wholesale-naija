// utils/fetchWithToken.ts
export interface FetchWithTokenOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchWithToken<T = unknown>(
  endpoint: string,
  options: FetchWithTokenOptions = {},
): Promise<T> {
  // Check if token exists in local storage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    throw new Error("No token found in localStorage");
  }

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://wholesalenaija-backend-9k01.onrender.com/api";

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Request failed (${res.status}): ${errorText || res.statusText}`,
      );
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    return (await res.text()) as T;
  } catch (err) {
    console.error("FetchWithToken error:", err);
    throw err instanceof Error ? err : new Error("Unknown error occurred");
  }
}
