// This file is no longer needed as all Gemini API calls are now server-side
// All AI functionality has been moved to secure server endpoints

export const getMedicineInfo = async (medicineName) => {
  // This function now calls the server-side API
  const response = await fetch("/api/medicine-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ medicineName }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch medicine information")
  }

  return response.json()
}

// Legacy function - kept for compatibility but redirects to server
export const generateMedicineInfo = getMedicineInfo
