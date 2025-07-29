// This file is deprecated and no longer used
// All Gemini API calls are now handled server-side through API routes
// See /api/medicine-info and /api/chat for server-side implementations

export const getMedicineInfo = () => {
  throw new Error("This function is deprecated. Use /api/medicine-info endpoint instead.")
}

export const getChatResponse = () => {
  throw new Error("This function is deprecated. Use /api/chat endpoint instead.")
}

// Legacy exports for backward compatibility
export default {
  getMedicineInfo,
  getChatResponse,
}
