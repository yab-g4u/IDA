// Predefined medicine information for common Ethiopian medicines
export const medicineDatabase = {
  // A
  Amoxicillin: {
    name: "Amoxicillin",
    category: "Antibiotic",
    description:
      "A penicillin antibiotic that fights bacteria in your body. Used to treat many different types of infection.",
    usageInstructions: "Take every 8-12 hours with or without food. Complete the full course as prescribed.",
    sideEffects: ["Diarrhea", "Stomach pain", "Nausea", "Vomiting", "Rash", "Allergic reactions"],
    warnings: [
      "May cause allergic reactions in penicillin-sensitive individuals",
      "May reduce effectiveness of birth control pills",
    ],
    interactions: ["Probenecid", "Allopurinol", "Certain blood thinners", "Other antibiotics"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "250-500mg", frequency: "Every 8 hours" },
      { ageGroup: "Children (>40kg)", dosage: "250-500mg", frequency: "Every 8 hours" },
      { ageGroup: "Children (<40kg)", dosage: "20-40mg/kg", frequency: "Divided into 3 doses daily" },
    ],
  },
  Atorvastatin: {
    name: "Atorvastatin",
    category: "Statin",
    description: "A medication used to lower blood cholesterol and reduce the risk of cardiovascular disease.",
    usageInstructions: "Take once daily, with or without food, preferably in the evening.",
    sideEffects: ["Muscle pain", "Liver problems", "Digestive issues", "Headache", "Insomnia"],
    warnings: [
      "May cause liver damage",
      "Risk of muscle breakdown (rhabdomyolysis)",
      "Not recommended during pregnancy",
    ],
    interactions: ["Grapefruit juice", "Certain antibiotics", "Antifungal medications", "HIV medications"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "10-80mg", frequency: "Once daily" },
      { ageGroup: "Elderly", dosage: "10-20mg", frequency: "Once daily initially" },
      { ageGroup: "Children (10-17 years)", dosage: "10-20mg", frequency: "Once daily" },
    ],
  },
  Azithromycin: {
    name: "Azithromycin",
    category: "Antibiotic",
    description: "A macrolide antibiotic used to treat a variety of bacterial infections.",
    usageInstructions: "Take once daily, at least 1 hour before or 2 hours after meals.",
    sideEffects: ["Diarrhea", "Nausea", "Abdominal pain", "Headache", "Allergic reactions"],
    warnings: [
      "May cause heart rhythm problems",
      "Use caution in patients with liver or kidney disease",
      "May worsen myasthenia gravis",
    ],
    interactions: ["Antacids containing aluminum or magnesium", "Warfarin", "Digoxin", "Nelfinavir"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "500mg on day 1, then 250mg", frequency: "Once daily for 4 more days" },
      { ageGroup: "Children (>45kg)", dosage: "Adult dose", frequency: "Adult schedule" },
      {
        ageGroup: "Children (<45kg)",
        dosage: "10mg/kg on day 1, then 5mg/kg",
        frequency: "Once daily for 4 more days",
      },
    ],
  },
  Amlodipine: {
    name: "Amlodipine",
    category: "Calcium Channel Blocker",
    description: "A medication used to treat high blood pressure and coronary artery disease.",
    usageInstructions: "Take once daily with or without food.",
    sideEffects: ["Swelling in ankles or feet", "Flushing", "Headache", "Dizziness", "Fatigue"],
    warnings: [
      "May cause low blood pressure",
      "Use caution in liver disease",
      "May worsen heart failure in some patients",
    ],
    interactions: ["Simvastatin", "Cyclosporine", "Grapefruit juice", "Other blood pressure medications"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults (Hypertension)", dosage: "5-10mg", frequency: "Once daily" },
      { ageGroup: "Adults (Angina)", dosage: "5-10mg", frequency: "Once daily" },
      { ageGroup: "Elderly", dosage: "2.5mg", frequency: "Once daily initially" },
    ],
  },
  Albendazole: {
    name: "Albendazole",
    category: "Anthelmintic",
    description: "A medication used to treat a variety of parasitic worm infestations.",
    usageInstructions: "Take with food, especially fatty meals to increase absorption.",
    sideEffects: ["Headache", "Nausea", "Abdominal pain", "Dizziness", "Fever"],
    warnings: ["May cause liver problems", "Not recommended during pregnancy", "May reduce white blood cell count"],
    interactions: ["Dexamethasone", "Praziquantel", "Cimetidine", "Theophylline"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "400mg", frequency: "Once or twice daily depending on infection" },
      { ageGroup: "Children (>2 years)", dosage: "400mg", frequency: "Once or twice daily depending on infection" },
      { ageGroup: "Children (<2 years)", dosage: "200mg", frequency: "Once or twice daily depending on infection" },
    ],
  },
  // B
  Bisoprolol: {
    name: "Bisoprolol",
    category: "Beta Blocker",
    description: "A medication used to treat high blood pressure and heart failure.",
    usageInstructions: "Take once daily with or without food, preferably in the morning.",
    sideEffects: ["Fatigue", "Dizziness", "Headache", "Cold hands and feet", "Slow heart rate"],
    warnings: ["Do not stop suddenly", "May mask symptoms of low blood sugar", "Use caution in asthma or COPD"],
    interactions: ["Insulin", "Oral diabetes medications", "Calcium channel blockers", "Digoxin"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults (Hypertension)", dosage: "5-20mg", frequency: "Once daily" },
      { ageGroup: "Adults (Heart Failure)", dosage: "1.25-10mg", frequency: "Once daily" },
      { ageGroup: "Elderly", dosage: "2.5-5mg", frequency: "Once daily initially" },
    ],
  },
  Budesonide: {
    name: "Budesonide",
    category: "Corticosteroid",
    description: "A medication used to treat asthma, allergic rhinitis, and inflammatory bowel disease.",
    usageInstructions: "Inhaler: Rinse mouth after use. Nasal spray: Clear nasal passages before use.",
    sideEffects: ["Throat irritation", "Hoarseness", "Oral thrush", "Headache", "Nosebleeds (nasal spray)"],
    warnings: [
      "May suppress immune system",
      "Long-term use may cause adrenal suppression",
      "May slow growth in children",
    ],
    interactions: ["Ketoconazole", "Itraconazole", "Ritonavir", "Clarithromycin"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults (Asthma)", dosage: "200-800mcg", frequency: "Twice daily" },
      { ageGroup: "Children (Asthma)", dosage: "100-400mcg", frequency: "Twice daily" },
      { ageGroup: "Adults (Rhinitis)", dosage: "64-256mcg", frequency: "Once or twice daily" },
    ],
  },
  // C
  Ciprofloxacin: {
    name: "Ciprofloxacin",
    category: "Fluoroquinolone Antibiotic",
    description: "A broad-spectrum antibiotic used to treat various bacterial infections.",
    usageInstructions: "Take with or without food. Drink plenty of fluids while taking.",
    sideEffects: ["Nausea", "Diarrhea", "Headache", "Tendon inflammation or rupture", "Sensitivity to light"],
    warnings: [
      "May cause tendon damage",
      "May worsen myasthenia gravis",
      "May affect mental health",
      "Not recommended for children except in specific cases",
    ],
    interactions: ["Antacids", "Iron supplements", "Dairy products", "Caffeine", "Theophylline"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "250-750mg", frequency: "Every 12 hours" },
      { ageGroup: "Children (specific infections only)", dosage: "10-20mg/kg", frequency: "Every 12 hours" },
    ],
  },
  Ceftriaxone: {
    name: "Ceftriaxone",
    category: "Cephalosporin Antibiotic",
    description: "A third-generation cephalosporin antibiotic used to treat various bacterial infections.",
    usageInstructions: "Administered by injection by healthcare professionals.",
    sideEffects: ["Pain at injection site", "Rash", "Diarrhea", "Nausea", "Allergic reactions"],
    warnings: [
      "May cause allergic reactions in penicillin-sensitive individuals",
      "May affect liver and gallbladder function",
      "Use caution in newborns, especially premature infants",
    ],
    interactions: ["Calcium-containing products", "Blood thinners", "Probenecid"],
    storageInstructions:
      "Store unreconstituted powder at room temperature. After reconstitution, follow specific storage instructions.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "1-2g", frequency: "Once or twice daily" },
      { ageGroup: "Children", dosage: "50-100mg/kg", frequency: "Once daily" },
      { ageGroup: "Neonates", dosage: "20-50mg/kg", frequency: "Once daily" },
    ],
  },
  Cotrimoxazole: {
    name: "Cotrimoxazole",
    category: "Antibiotic Combination",
    description: "A combination of trimethoprim and sulfamethoxazole used to treat various bacterial infections.",
    usageInstructions: "Take with a full glass of water, with or without food.",
    sideEffects: ["Rash", "Nausea", "Vomiting", "Diarrhea", "Allergic reactions", "Sensitivity to light"],
    warnings: [
      "May cause severe skin reactions",
      "Use caution in kidney or liver disease",
      "May cause blood disorders",
      "Not recommended in late pregnancy",
    ],
    interactions: ["Warfarin", "Phenytoin", "Methotrexate", "ACE inhibitors", "Diuretics"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "1-2 tablets (80/400mg or 160/800mg)", frequency: "Every 12 hours" },
      { ageGroup: "Children", dosage: "8/40mg per kg", frequency: "Divided into 2 doses daily" },
    ],
  },
  // D
  Diclofenac: {
    name: "Diclofenac",
    category: "NSAID",
    description: "A nonsteroidal anti-inflammatory drug used to treat pain and inflammation.",
    usageInstructions: "Take with food to reduce stomach upset. Swallow tablets whole with water.",
    sideEffects: [
      "Stomach pain",
      "Heartburn",
      "Nausea",
      "Headache",
      "Dizziness",
      "Increased risk of heart attack and stroke",
    ],
    warnings: [
      "Increased risk of heart attack and stroke",
      "May cause stomach bleeding",
      "Use caution in kidney or liver disease",
      "Avoid in late pregnancy",
    ],
    interactions: ["Blood thinners", "Aspirin", "Other NSAIDs", "Lithium", "Methotrexate", "Cyclosporine"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "50-150mg", frequency: "Divided into 2-3 doses daily" },
      { ageGroup: "Not recommended for children", dosage: "N/A", frequency: "N/A" },
    ],
  },
  Doxycycline: {
    name: "Doxycycline",
    category: "Tetracycline Antibiotic",
    description: "A broad-spectrum antibiotic used to treat various bacterial infections and malaria prevention.",
    usageInstructions: "Take with a full glass of water. Do not lie down for at least 30 minutes after taking.",
    sideEffects: ["Nausea", "Vomiting", "Diarrhea", "Sensitivity to light", "Rash"],
    warnings: [
      "May cause permanent tooth discoloration in children under 8",
      "May reduce effectiveness of birth control pills",
      "Avoid sun exposure",
      "Avoid in pregnancy",
    ],
    interactions: ["Antacids", "Iron supplements", "Calcium supplements", "Dairy products", "Warfarin"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "100mg", frequency: "Once or twice daily" },
      { ageGroup: "Children (>8 years)", dosage: "2-4mg/kg", frequency: "Divided into 1-2 doses daily" },
      { ageGroup: "Not recommended for children under 8", dosage: "N/A", frequency: "N/A" },
    ],
  },
  // E
  Enalapril: {
    name: "Enalapril",
    category: "ACE Inhibitor",
    description: "A medication used to treat high blood pressure, heart failure, and diabetic kidney disease.",
    usageInstructions: "Take with or without food at the same time each day.",
    sideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue", "High potassium levels"],
    warnings: [
      "May cause serious harm or death to unborn babies",
      "May cause angioedema (swelling of face, lips, tongue)",
      "May cause kidney problems",
    ],
    interactions: ["Potassium supplements", "Potassium-sparing diuretics", "Lithium", "NSAIDs"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults (Hypertension)", dosage: "5-40mg", frequency: "Once or twice daily" },
      { ageGroup: "Adults (Heart Failure)", dosage: "2.5-20mg", frequency: "Twice daily" },
      { ageGroup: "Children", dosage: "0.08mg/kg", frequency: "Once daily initially" },
    ],
  },
  Erythromycin: {
    name: "Erythromycin",
    category: "Macrolide Antibiotic",
    description: "An antibiotic used to treat various bacterial infections.",
    usageInstructions: "Take on an empty stomach, 1 hour before or 2 hours after meals, unless directed otherwise.",
    sideEffects: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Rash"],
    warnings: ["May cause heart rhythm problems", "Use caution in liver disease", "May worsen myasthenia gravis"],
    interactions: ["Statins", "Warfarin", "Digoxin", "Theophylline", "Carbamazepine"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "250-500mg", frequency: "Every 6-12 hours" },
      { ageGroup: "Children", dosage: "30-50mg/kg", frequency: "Divided into 2-4 doses daily" },
    ],
  },
  // F
  Fluoxetine: {
    name: "Fluoxetine",
    category: "SSRI Antidepressant",
    description: "A selective serotonin reuptake inhibitor used to treat depression, OCD, panic disorder, and bulimia.",
    usageInstructions: "Take in the morning with or without food.",
    sideEffects: ["Nausea", "Insomnia", "Headache", "Anxiety", "Decreased appetite", "Sexual dysfunction"],
    warnings: [
      "May increase risk of suicidal thoughts in young adults",
      "May cause serotonin syndrome when combined with certain medications",
      "Use caution in liver or kidney disease",
    ],
    interactions: ["MAO inhibitors", "Triptans", "Other antidepressants", "Tramadol", "Lithium"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults (Depression)", dosage: "20-80mg", frequency: "Once daily" },
      { ageGroup: "Adults (OCD)", dosage: "20-80mg", frequency: "Once daily" },
      { ageGroup: "Children (8-18 years)", dosage: "10-20mg", frequency: "Once daily" },
    ],
  },
  Furosemide: {
    name: "Furosemide",
    category: "Loop Diuretic",
    description:
      "A medication used to treat fluid retention and swelling caused by heart failure, liver disease, or kidney disease.",
    usageInstructions: "Take in the morning to avoid nighttime urination. Take with food if stomach upset occurs.",
    sideEffects: [
      "Frequent urination",
      "Dehydration",
      "Dizziness",
      "Low potassium levels",
      "Hearing problems (with high doses)",
    ],
    warnings: [
      "May cause dehydration and electrolyte imbalances",
      "Monitor kidney function and electrolytes",
      "May increase blood sugar levels",
    ],
    interactions: ["Lithium", "Digoxin", "Aminoglycoside antibiotics", "NSAIDs", "Other blood pressure medications"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults (Edema)", dosage: "20-80mg", frequency: "Once or twice daily" },
      { ageGroup: "Adults (Hypertension)", dosage: "40mg", frequency: "Twice daily" },
      { ageGroup: "Children", dosage: "1-2mg/kg", frequency: "Once or twice daily" },
    ],
  },
  // G
  Glibenclamide: {
    name: "Glibenclamide",
    category: "Sulfonylurea Antidiabetic",
    description: "A medication used to treat type 2 diabetes by stimulating insulin release from the pancreas.",
    usageInstructions: "Take with breakfast or the first main meal of the day.",
    sideEffects: ["Low blood sugar", "Weight gain", "Nausea", "Skin rash", "Liver problems"],
    warnings: [
      "Risk of hypoglycemia (low blood sugar)",
      "Use caution in kidney or liver disease",
      "Alcohol may increase risk of hypoglycemia",
    ],
    interactions: ["Beta-blockers", "Corticosteroids", "Thiazide diuretics", "NSAIDs", "Warfarin"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "2.5-20mg", frequency: "Once or twice daily" },
      { ageGroup: "Elderly", dosage: "1.25-5mg", frequency: "Once daily initially" },
      { ageGroup: "Not recommended for children", dosage: "N/A", frequency: "N/A" },
    ],
  },
  // H
  Hydrochlorothiazide: {
    name: "Hydrochlorothiazide",
    category: "Thiazide Diuretic",
    description: "A medication used to treat high blood pressure and fluid retention.",
    usageInstructions: "Take in the morning to avoid nighttime urination. May be taken with or without food.",
    sideEffects: [
      "Increased urination",
      "Dizziness",
      "Low potassium levels",
      "Increased blood sugar",
      "Sensitivity to sunlight",
    ],
    warnings: [
      "May cause electrolyte imbalances",
      "May increase blood sugar levels",
      "May increase uric acid levels",
      "Use caution in gout, diabetes, or kidney disease",
    ],
    interactions: ["Lithium", "Digoxin", "NSAIDs", "Diabetes medications", "Cholestyramine"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults (Hypertension)", dosage: "12.5-50mg", frequency: "Once daily" },
      { ageGroup: "Adults (Edema)", dosage: "25-100mg", frequency: "Once or twice daily" },
      { ageGroup: "Children", dosage: "1-2mg/kg", frequency: "Once daily" },
    ],
  },
  // I
  Ibuprofen: {
    name: "Ibuprofen",
    category: "NSAID",
    description: "A nonsteroidal anti-inflammatory drug used to reduce fever and treat pain or inflammation.",
    usageInstructions:
      "Take with food or milk to reduce stomach upset. Take lowest effective dose for shortest duration.",
    sideEffects: [
      "Stomach pain",
      "Heartburn",
      "Nausea",
      "Dizziness",
      "Rash",
      "Increased risk of heart attack and stroke",
    ],
    warnings: [
      "Increased risk of heart attack and stroke",
      "May cause stomach bleeding",
      "Use caution in elderly patients",
      "Avoid in late pregnancy",
    ],
    interactions: ["Blood thinners", "Aspirin", "Other NSAIDs", "Diuretics", "ACE inhibitors", "Lithium"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "200-400mg", frequency: "Every 4-6 hours, not exceeding 3200mg/day" },
      {
        ageGroup: "Children (6 months-12 years)",
        dosage: "5-10mg/kg",
        frequency: "Every 6-8 hours, not exceeding 40mg/kg/day",
      },
      { ageGroup: "Not recommended for children under 6 months", dosage: "N/A", frequency: "N/A" },
    ],
  },
  Insulin: {
    name: "Insulin",
    category: "Hormone",
    description: "A hormone used to treat diabetes by helping the body use glucose for energy.",
    usageInstructions: "Inject subcutaneously as directed. Rotate injection sites.",
    sideEffects: ["Low blood sugar", "Weight gain", "Injection site reactions", "Allergic reactions"],
    warnings: [
      "Risk of hypoglycemia (low blood sugar)",
      "Do not use if solution is cloudy or contains particles",
      "Proper storage is essential",
    ],
    interactions: ["Beta-blockers", "Alcohol", "Oral diabetes medications", "Corticosteroids", "Thyroid medications"],
    storageInstructions:
      "Unopened vials/pens should be stored in the refrigerator. In-use insulin can be kept at room temperature for specified time periods.",
    dosageInfo: [
      {
        ageGroup: "All ages",
        dosage: "Individualized",
        frequency: "According to blood glucose levels and medical advice",
      },
    ],
  },
  // L
  Losartan: {
    name: "Losartan",
    category: "Angiotensin II Receptor Blocker",
    description:
      "A medication used to treat high blood pressure and to help protect the kidneys from damage due to diabetes.",
    usageInstructions: "Take with or without food at the same time each day.",
    sideEffects: ["Dizziness", "Headache", "Diarrhea", "Cough", "Upper respiratory infection"],
    warnings: [
      "May cause serious harm or death to unborn babies",
      "May cause kidney problems",
      "May cause high potassium levels",
    ],
    interactions: ["Potassium supplements", "Potassium-sparing diuretics", "Lithium", "NSAIDs"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults (Hypertension)", dosage: "25-100mg", frequency: "Once daily" },
      { ageGroup: "Adults (Diabetic Nephropathy)", dosage: "50-100mg", frequency: "Once daily" },
      { ageGroup: "Children (>6 years)", dosage: "0.7mg/kg up to 50mg", frequency: "Once daily" },
    ],
  },
  // M
  Metformin: {
    name: "Metformin",
    category: "Antidiabetic",
    description:
      "A medication used to treat type 2 diabetes by improving the body's response to insulin and reducing glucose production.",
    usageInstructions: "Take with meals to reduce stomach upset. Swallow extended-release tablets whole.",
    sideEffects: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Stomach pain",
      "Metallic taste",
      "Vitamin B12 deficiency with long-term use",
    ],
    warnings: [
      "Risk of lactic acidosis",
      "Avoid in severe kidney disease",
      "Temporarily stop before procedures using contrast dye",
      "May need to stop during acute illness",
    ],
    interactions: ["Certain antibiotics", "Cimetidine", "Contrast dyes", "Carbonic anhydrase inhibitors", "Alcohol"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "500-2550mg", frequency: "Divided into 2-3 doses daily" },
      { ageGroup: "Adults (Extended release)", dosage: "500-2000mg", frequency: "Once daily" },
      { ageGroup: "Children (10-16 years)", dosage: "500-2000mg", frequency: "Divided into 2 doses daily" },
    ],
  },
  Metronidazole: {
    name: "Metronidazole",
    category: "Antibiotic and Antiprotozoal",
    description: "A medication used to treat bacterial and parasitic infections.",
    usageInstructions: "Take with food to reduce stomach upset. Avoid alcohol during treatment and for 3 days after.",
    sideEffects: ["Nausea", "Metallic taste", "Diarrhea", "Headache", "Dizziness", "Darkened urine"],
    warnings: [
      "Avoid alcohol completely during treatment",
      "May cause seizures and nerve problems",
      "Use caution in liver disease",
    ],
    interactions: ["Alcohol", "Warfarin", "Lithium", "Busulfan", "Disulfiram"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "250-750mg", frequency: "Every 8 hours" },
      { ageGroup: "Children", dosage: "7.5mg/kg", frequency: "Every 8 hours" },
    ],
  },
  // O
  Omeprazole: {
    name: "Omeprazole",
    category: "Proton Pump Inhibitor",
    description:
      "A medication used to reduce stomach acid production and treat conditions such as heartburn, ulcers, and GERD.",
    usageInstructions: "Take before meals. Swallow capsules whole; do not crush or chew.",
    sideEffects: ["Headache", "Nausea", "Diarrhea", "Abdominal pain", "Vitamin B12 deficiency with long-term use"],
    warnings: [
      "Long-term use may increase risk of bone fractures",
      "May increase risk of intestinal infections",
      "May reduce magnesium levels with long-term use",
    ],
    interactions: ["Clopidogrel", "Diazepam", "Phenytoin", "Warfarin", "Iron supplements"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "20-40mg", frequency: "Once daily" },
      { ageGroup: "Children", dosage: "0.7-3.3mg/kg", frequency: "Once daily" },
    ],
  },
  // P
  Paracetamol: {
    name: "Paracetamol",
    category: "Analgesic/Antipyretic",
    description: "A medication used to treat pain and fever. Also known as acetaminophen.",
    usageInstructions: "Take as needed for pain or fever. Do not exceed recommended dose.",
    sideEffects: ["Rare when taken as directed", "Nausea", "Rash", "Liver damage (with overdose)"],
    warnings: [
      "Liver damage with overdose",
      "Use caution with alcohol",
      "Check other medications for paracetamol content to avoid overdose",
    ],
    interactions: ["Alcohol", "Warfarin", "Isoniazid", "Carbamazepine", "Phenytoin"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "500-1000mg", frequency: "Every 4-6 hours, not exceeding 4000mg/day" },
      {
        ageGroup: "Children (6-12 years)",
        dosage: "250-500mg",
        frequency: "Every 4-6 hours, not exceeding 2000mg/day",
      },
      { ageGroup: "Children (1-5 years)", dosage: "120-250mg", frequency: "Every 4-6 hours, not exceeding 1000mg/day" },
    ],
  },
  Prednisolone: {
    name: "Prednisolone",
    category: "Corticosteroid",
    description:
      "A steroid medication used to treat inflammation, allergic reactions, autoimmune disorders, and certain cancers.",
    usageInstructions: "Take with food to reduce stomach upset. Do not stop suddenly without medical advice.",
    sideEffects: [
      "Increased appetite",
      "Weight gain",
      "Mood changes",
      "Insomnia",
      "High blood sugar",
      "Fluid retention",
    ],
    warnings: [
      "Long-term use may cause adrenal suppression",
      "May mask signs of infection",
      "May cause osteoporosis with long-term use",
      "May slow growth in children",
    ],
    interactions: ["NSAIDs", "Diabetes medications", "Blood thinners", "Vaccines", "Ketoconazole"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "5-60mg", frequency: "Once daily or divided doses" },
      { ageGroup: "Children", dosage: "0.1-2mg/kg", frequency: "Once daily or divided doses" },
    ],
  },
  // R
  Ranitidine: {
    name: "Ranitidine",
    category: "H2 Blocker",
    description:
      "A medication used to reduce stomach acid production and treat conditions such as heartburn, ulcers, and GERD.",
    usageInstructions: "Take with or without food. Take at the same time each day.",
    sideEffects: ["Headache", "Dizziness", "Constipation", "Diarrhea", "Rash"],
    warnings: [
      "Use caution in kidney or liver disease",
      "May cause confusion in elderly patients",
      "Some formulations have been recalled due to potential contamination",
    ],
    interactions: ["Antacids", "Ketoconazole", "Itraconazole", "Glipizide", "Warfarin"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "150mg", frequency: "Twice daily or 300mg once daily" },
      { ageGroup: "Children", dosage: "2-4mg/kg", frequency: "Twice daily" },
    ],
  },
  // S
  Salbutamol: {
    name: "Salbutamol",
    category: "Bronchodilator",
    description:
      "A medication used to treat asthma, COPD, and other conditions that cause breathing problems. Also known as albuterol.",
    usageInstructions: "Inhale as directed. Shake inhaler well before use.",
    sideEffects: ["Tremor", "Nervousness", "Headache", "Rapid heartbeat", "Throat irritation"],
    warnings: [
      "Overuse may lead to worsening symptoms",
      "May cause paradoxical bronchospasm",
      "Use caution in heart disease, high blood pressure, or diabetes",
    ],
    interactions: ["Beta-blockers", "Diuretics", "Digoxin", "Other bronchodilators", "Monoamine oxidase inhibitors"],
    storageInstructions: "Store at room temperature away from moisture, heat, and light. Keep inhaler clean and dry.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "1-2 puffs (100-200mcg)", frequency: "Every 4-6 hours as needed" },
      { ageGroup: "Children", dosage: "1-2 puffs (100-200mcg)", frequency: "Every 4-6 hours as needed" },
    ],
  },
  // T
  Tramadol: {
    name: "Tramadol",
    category: "Opioid Analgesic",
    description: "A medication used to treat moderate to severe pain.",
    usageInstructions: "Take with or without food. Swallow extended-release tablets whole.",
    sideEffects: ["Dizziness", "Nausea", "Constipation", "Headache", "Drowsiness", "Sweating"],
    warnings: [
      "Risk of addiction, abuse, and misuse",
      "Risk of life-threatening respiratory depression",
      "May cause seizures",
      "May cause serotonin syndrome when combined with certain medications",
    ],
    interactions: ["Antidepressants", "Sedatives", "Other opioids", "Alcohol", "Carbamazepine"],
    storageInstructions: "Store at room temperature away from moisture and heat. Keep out of reach of children.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "50-100mg", frequency: "Every 4-6 hours, not exceeding 400mg/day" },
      { ageGroup: "Elderly (>75 years)", dosage: "50mg", frequency: "Every 6 hours, not exceeding 300mg/day" },
      { ageGroup: "Not recommended for children under 12", dosage: "N/A", frequency: "N/A" },
    ],
  },
  // W
  Warfarin: {
    name: "Warfarin",
    category: "Anticoagulant",
    description: "A medication used to prevent blood clots from forming or growing larger.",
    usageInstructions: "Take at the same time each day. Maintain consistent vitamin K intake in diet.",
    sideEffects: ["Bleeding", "Bruising", "Nausea", "Hair loss", "Rash"],
    warnings: [
      "Risk of serious bleeding",
      "Regular INR monitoring required",
      "Many drug and food interactions",
      "Avoid activities with high risk of injury",
    ],
    interactions: ["Many antibiotics", "NSAIDs", "Aspirin", "Herbal supplements", "Foods high in vitamin K"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "Individualized", frequency: "Once daily based on INR results" },
      { ageGroup: "Children", dosage: "Individualized", frequency: "Once daily based on INR results" },
    ],
  },
  // Z
  "Zinc Sulfate": {
    name: "Zinc Sulfate",
    category: "Mineral Supplement",
    description: "A mineral supplement used to treat or prevent zinc deficiency.",
    usageInstructions: "Take with food to reduce stomach upset. Take with a full glass of water.",
    sideEffects: ["Nausea", "Vomiting", "Diarrhea", "Stomach pain", "Metallic taste"],
    warnings: [
      "May interfere with absorption of certain antibiotics",
      "High doses may cause zinc toxicity",
      "Use caution in kidney disease",
    ],
    interactions: ["Tetracycline antibiotics", "Quinolone antibiotics", "Iron supplements", "Copper supplements"],
    storageInstructions: "Store at room temperature away from moisture and heat.",
    dosageInfo: [
      { ageGroup: "Adults", dosage: "25-50mg elemental zinc", frequency: "Once daily" },
      { ageGroup: "Children", dosage: "10-20mg elemental zinc", frequency: "Once daily" },
    ],
  },
}

export const medicineList = Object.keys(medicineDatabase)

// Add the missing export for the API route
export const medicines = Object.entries(medicineDatabase).map(([key, medicine]) => ({
  id: key.toLowerCase().replace(/\s+/g, "-"),
  ...medicine,
}))
