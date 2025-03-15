import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const getMedicineInfo = async (medicineName, searchResults) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Imagine people who ask you about medicines have no clue and are not professionals.
    Please generate a detailed but simple and easy-to-understand overview for the medicine "${medicineName}" 
    using the following search results: ${JSON.stringify(searchResults)}.
    Format the response in this JSON structure:
    {
      "medicine_uses": "<describe primary and secondary uses>",
      "medicine_side_effects": "<list common and serious side effects>",
      "medicine_benefits": "<describe benefits and effectiveness>",
      "medicine_monitoring_precautions": "<provide monitoring guidelines and precautions>",
      "medicine_medical_history": "<outline important medical history considerations>",
      "medicine_inhibitor_testing": "<describe inhibitor testing information>",
      "medicine_ages_dosage": "<provide recommended age range and dosage guidelines>"
    }
    If any section is not applicable, use "N/A".
    Ensure accuracy for Ethiopia’s medical context.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text(); // Get the AI-generated response
    return JSON.parse(text); // Convert response to JSON format
  } catch (error) {
    console.error("Error fetching medicine details:", error);
    return { error: "Failed to fetch medicine details" };
  }
};

