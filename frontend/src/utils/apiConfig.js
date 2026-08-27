// Base API configuration for GRMS
// Supports custom VITE_API_URL in production (Render) with automatic localhost fallback in development

const sanitizeUrl = (url) => (url ? url.trim().replace(/\/$/, "") : "");

export const API_BASE_URL =
  sanitizeUrl(import.meta.env.VITE_API_URL) ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "");

export const getApiUrl = (endpoint = "") => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
