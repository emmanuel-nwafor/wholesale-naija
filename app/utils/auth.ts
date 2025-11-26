// utils/auth.ts
let cachedSellerId: string | null = null;
let tokenValidated = false;

const validateToken = async (): Promise<boolean> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return false;

    const res = await fetch(
      "https://wholesalenaija-backend-9k01.onrender.com/api/auth/check",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
};

export const getCurrentSellerId = async (): Promise<string | null> => {
  if (cachedSellerId && tokenValidated) return cachedSellerId;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    cachedSellerId = null;
    tokenValidated = false;
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id || payload._id || payload.userId || payload.sellerId;

    if (!id) return null;

    const isValid = await validateToken();
    if (!isValid) {
      localStorage.removeItem("token");
      cachedSellerId = null;
      tokenValidated = false;
      return null;
    }

    cachedSellerId = id;
    tokenValidated = true;
    return id;
  } catch (err) {
    console.error("JWT decode failed:", err);
    return null;
  }
};

export const clearSellerIdCache = () => {
  cachedSellerId = null;
  tokenValidated = false;
};