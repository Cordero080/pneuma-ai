// ============================================================
// API Configuration
// Centralized backend URL configuration
// ============================================================

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
  tts: `${API_BASE_URL}/tts`,
};
