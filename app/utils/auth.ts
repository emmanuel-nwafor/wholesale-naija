// utils/auth.ts

let cachedSellerId: string | null = null;
let cachedProductId: string | null = null; 

// Get current seller ID
export const getCurrentSellerId = (): string | null => {
  if (cachedSellerId !== null) return cachedSellerId;

  if (typeof window === "undefined") return null;

  const directId = localStorage.getItem("sellerId");
  if (directId) {
    cachedSellerId = directId;
    return directId;
  }

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    const id = user?.id || user?._id || user?.sellerId;
    if (id) cachedSellerId = id;
    return id || null;
  } catch {
    return null;
  }
};

// Get current product ID (from last viewed product)
export const getCurrentProductId = (): string | null => {
  if (cachedProductId !== null) return cachedProductId;

  if (typeof window === "undefined") return null;

  const id = localStorage.getItem("currentProductId");
  cachedProductId = id;
  return id;
};

// Save current product ID (call this when viewing a product)
export const setCurrentProductId = (id: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentProductId", id);
  cachedProductId = id;
};

// Clear all caches (on logout)
export const clearAuthCache = () => {
  cachedSellerId = null;
  cachedProductId = null;
  localStorage.removeItem("currentProductId");
};