export const ethiopianMedicines = [
  "Amoxicillin",
  "Paracetamol",
  "Metformin",
  "Artemether/Lumefantrine",
  "Cotrimoxazole",
  "Omeprazole",
  "Ciprofloxacin",
  "Diclofenac",
  "Enalapril",
  "Hydrochlorothiazide",
  "Metronidazole",
  "Salbutamol",
  "Ibuprofen",
  "Ceftriaxone",
  "Doxycycline",
  "Fluoxetine",
  "Insulin",
  "Losartan",
  "Atorvastatin",
  "Azithromycin",
  "Diazepam",
  "Furosemide",
  "Glibenclamide",
  "Ranitidine",
  "Tramadol",
  "Warfarin",
  "Zinc Sulfate",
  "Albendazole",
  "Amlodipine",
  "Cephalexin",
]

// Ethiopian cities and locations
export const ethiopianLocations = [
  "Addis Ababa",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Bahir Dar",
  "Hawassa",
  "Adama",
  "Jimma",
  "Dessie",
  "Debre Berhan",
  "Shashamane",
  "Bishoftu",
  "Sodo",
  "Arba Minch",
  "Hosaena",
  "Harar",
  "Dilla",
  "Nekemte",
  "Debre Markos",
  "Asella",
  "Ambo",
  "Gambella",
  "Axum",
  "Jijiga",
  "Adigrat",
  "Woldiya",
  "Sebeta",
  "Bule Hora",
  "Bonga",
  "Kombolcha",
]

export function filterSuggestions(input: string, data: string[]): string[] {
  if (!input.trim()) return []

  const lowerInput = input.toLowerCase()
  return data.filter((item) => item.toLowerCase().includes(lowerInput)).slice(0, 5) // Limit to 5 suggestions
}

