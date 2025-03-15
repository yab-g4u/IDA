import { getMedicineInfo } from "../../utils/gemini";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { medicineName, searchResults } = req.body;

  if (!medicineName) {
    return res.status(400).json({ error: "Medicine name is required" });
  }

  try {
    const medicineData = await getMedicineInfo(medicineName, searchResults);
    res.status(200).json(medicineData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medicine data" });
  }
}

