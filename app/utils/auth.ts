// utils/auth.ts

let cachedSellerId: string | null = null;

/**
 * Get the current seller ID from localStorage (saved on login)
 * Super fast, no network, no JWT parsing
 */
export const getCurrentSellerId = (): string | null => {
  // Return cached value if already loaded
  if (cachedSellerId !== null) {
    return cachedSellerId;
  }

  // Only run in browser
  if (typeof window === "undefined") {
    return null;
  }

  // Try to get from direct sellerId key first (most reliable)
  const directId = localStorage.getItem("sellerId");
  if (directId) {
    cachedSellerId = directId;
    return directId;
  }

  // Fallback: read from full user object
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    cachedSellerId = null;
    return null;
  }

  try {
    const user = JSON.parse(userStr);
    const id = user?.id || user?._id || user?.sellerId;

    if (id) {
      cachedSellerId = id;
      return id;
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
  }

  cachedSellerId = null;
  return null;
};

/**
 * Clear cache (use on logout)
 */
export const clearSellerIdCache = () => {
  cachedSellerId = null;
};

/**
 * Optional: Get full user object
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};