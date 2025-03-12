"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "am"

type TranslationKey =
  | "home"
  | "medicineSearch"
  | "pharmacyFinder"
  | "about"
  | "findMedicineInfo"
  | "instantly"
  | "getDetailedInfo"
  | "searchMedicines"
  | "findPharmacies"
  | "howIDAHelps"
  | "aiPoweredPlatform"
  | "medicineInformation"
  | "getDetailedDescriptions"
  | "pharmacyLocator"
  | "findNearbyPharmacies"
  | "readyToFind"
  | "startSearching"
  | "getStarted"
  | "enterMedicineName"
  | "search"
  | "noMedicineInfo"
  | "searchForMedicine"
  | "recentSearches"
  | "noSearchHistory"
  | "findPharmaciesNearYou"
  | "enterYourLocation"
  | "useMyLocation"
  | "loading"
  | "loginToAccess"
  | "createAccount"
  | "email"
  | "password"
  | "signIn"
  | "signUp"
  | "orContinueWith"
  | "welcomeBack"
  | "ourMission"
  | "missionDescription"
  | "howItWorks"
  | "searchMedicinesDesc"
  | "aiAnalysis"
  | "aiAnalysisDesc"
  | "pharmacyLocatorDesc"
  | "ourTechnology"
  | "techDescription"
  | "ourTeam"
  | "fullStackDev"
  | "backendDev"
  | "frontendDev"
  | "uiuxDesigner"
  | "hackathonProject"
  | "hackathonDesc"
  | "viewGithub"
  | "aiAssistantTitle"
  | "aiAssistantMessages"

type Translations = {
  [key in Language]: {
    [key in TranslationKey]: string | string[]
  }
}

const translations: Translations = {
  en: {
    home: "Home",
    medicineSearch: "Medicine Search",
    pharmacyFinder: "Pharmacy Finder",
    about: "About",
    findMedicineInfo: "Find Medicine Information",
    instantly: "Instantly",
    getDetailedInfo:
      "Get detailed information about medications and locate nearby pharmacies with our AI-powered assistant.",
    searchMedicines: "Search Medicines",
    findPharmacies: "Find Pharmacies",
    howIDAHelps: "How IDA Helps You",
    aiPoweredPlatform:
      "Our AI-powered platform provides comprehensive information about medications and helps you find nearby pharmacies.",
    medicineInformation: "Medicine Information",
    getDetailedDescriptions:
      "Get detailed descriptions, usage instructions, side effects, and precautions for any medication.",
    pharmacyLocator: "Pharmacy Locator",
    findNearbyPharmacies: "Find nearby pharmacies based on your current location or any address you provide.",
    readyToFind: "Ready to find the information you need?",
    startSearching: "Start searching for medicines or find nearby pharmacies with just a few clicks.",
    getStarted: "Get Started",
    enterMedicineName: "Enter medicine name (e.g., Aspirin, Paracetamol)",
    search: "Search",
    noMedicineInfo: "No medicine information yet",
    searchForMedicine: "Search for a medicine to see detailed information",
    recentSearches: "Recent Searches",
    noSearchHistory: "No search history yet",
    findPharmaciesNearYou: "Find Pharmacies Near You",
    enterYourLocation: "Enter your location (e.g., city, zip code)",
    useMyLocation: "Use My Location",
    loading: "Loading...",
    loginToAccess: "Sign in to access medicine information",
    createAccount: "Sign up to start using IDA",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Create Account",
    orContinueWith: "Or continue with",
    welcomeBack: "Welcome Back",
    ourMission: "Our Mission",
    missionDescription:
      "IDA was created to provide easy access to accurate and comprehensive information about medications. Our mission is to help people make informed decisions about their health by providing detailed descriptions of medicines and helping them locate nearby pharmacies.",
    howItWorks: "How It Works",
    searchMedicinesDesc: "Simply type the name of a medication to get comprehensive information about it.",
    aiAnalysis: "AI Analysis",
    aiAnalysisDesc: "Our AI agent processes your query and provides accurate, up-to-date information.",
    pharmacyLocatorDesc: "Find nearby pharmacies based on your location.",
    ourTechnology: "Our Technology",
    techDescription: "IDA is built using cutting-edge technology to provide a seamless and reliable experience:",
    ourTeam: "Our Team",
    fullStackDev: "Full Stack Developer",
    backendDev: "Backend Developer",
    frontendDev: "Frontend Developer",
    uiuxDesigner: "UI/UX Designer",
    hackathonProject: "Hackathon Project",
    hackathonDesc:
      "IDA was developed as part of the AI Agents Hackathon. Our team created this application to demonstrate the potential of AI agents in providing valuable healthcare information and services.",
    viewGithub: "View GitHub Profile",
    aiAssistantTitle: "AI-Powered Assistant",
    aiAssistantMessages: [
      "Get personalized medicine information",
      "Ask about drug interactions",
      "Learn about side effects",
      "Understand dosage instructions",
      "Discover alternative medications",
    ],
  },
  am: {
    home: "መነሻ",
    medicineSearch: "መድሃኒት ፍለጋ",
    pharmacyFinder: "ፋርማሲ አፈላላጊ",
    about: "ስለ እኛ",
    findMedicineInfo: "የመድሃኒት መረጃ ያግኙ",
    instantly: "በፍጥነት",
    getDetailedInfo: "ስለ መድሃኒቶች ዝርዝር መረጃ ያግኙ እና በአቅራቢያዎ ያሉ ፋርማሲዎችን በኛ ኤአይ የተጎናጸፈ ረዳት ያግኙ።",
    searchMedicines: "መድሃኒቶችን ይፈልጉ",
    findPharmacies: "ፋርማሲዎችን ያግኙ",
    howIDAHelps: "IDA እንዴት ይረዳዎታል",
    aiPoweredPlatform: "የኛ ኤአይ የተጎናጸፈ መድረክ ስለ መድሃኒቶች ሁሉን አቀፍ መረጃ ይሰጣል እና በአቅራቢያዎ ያሉ ፋርማሲዎችን እንዲያገኙ ይረዳዎታል።",
    medicineInformation: "የመድሃኒት መረጃ",
    getDetailedDescriptions: "ለማንኛውም መድሃኒት ዝርዝር መግለጫዎችን፣ የአጠቃቀም መመሪያዎችን፣ የጎንዮሽ ጉዳቶችን እና ጥንቃቄዎችን ያግኙ።",
    pharmacyLocator: "ፋርማሲ አፈላላጊ",
    findNearbyPharmacies: "በአሁኑ ቦታዎ ወይም በሚሰጡት አድራሻ መሰረት በአቅራቢያዎ ያሉ ፋርማሲዎችን ያግኙ።",
    readyToFind: "የሚፈልጉትን መረጃ ለማግኘት ዝግጁ ነዎት?",
    startSearching: "በጥቂት ጠቅታዎች መድሃኒቶችን መፈለግ ወይም በአቅራቢያዎ ያሉ ፋርማሲዎችን ማግኘት ይጀምሩ።",
    getStarted: "ይጀምሩ",
    enterMedicineName: "የመድሃኒት ስም ያስገቡ (ለምሳሌ፣ አስፕሪን፣ ፓራሲታሞል)",
    search: "ፍለጋ",
    noMedicineInfo: "እስካሁን የመድሃኒት መረጃ የለም",
    searchForMedicine: "ዝርዝር መረጃ ለማየት መድሃኒት ይፈልጉ",
    recentSearches: "የቅርብ ጊዜ ፍለጋዎች",
    noSearchHistory: "እስካሁን የፍለጋ ታሪክ የለም",
    findPharmaciesNearYou: "በአቅራቢያዎ ያሉ ፋርማሲዎችን ያግኙ",
    enterYourLocation: "ቦታዎን ያስገቡ (ለምሳሌ፣ ከተማ፣ ዚፕ ኮድ)",
    useMyLocation: "የእኔን ቦታ ይጠቀሙ",
    loading: "በመጫን ላይ...",
    loginToAccess: "የመድሃኒት መረጃ ለማግኘት ይግቡ",
    createAccount: "IDA መጠቀም ለመጀመር ይመዝገቡ",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    signIn: "ይግቡ",
    signUp: "አካውንት ይፍጠሩ",
    orContinueWith: "ወይም በዚህ ይቀጥሉ",
    welcomeBack: "እንኳን ደህና መጡ",
    ourMission: "የእኛ ተልእኮ",
    missionDescription:
      "IDA ስለ መድሃኒቶች ትክክለኛ እና ሁሉን አቀፍ መረጃ በቀላሉ ለማግኘት ተፈጥሯል። የእኛ ተልእኮ ሰዎች ስለ ጤናቸው መረጃ በመስጠት እና በአቅራቢያቸው ያሉ ፋርማሲዎችን እንዲያገኙ በመርዳት ጠንካራ ውሳኔ እንዲወስኑ መርዳት ነው።",
    howItWorks: "እንዴት እንደሚሰራ",
    searchMedicinesDesc: "የመድሃኒቱን ስም ብቻ ይጻፉ እና ሁሉንም መረጃ ያግኙ።",
    aiAnalysis: "የሰው ሰራሽ አእምሮ ትንተና",
    aiAnalysisDesc: "የእኛ AI ወኪል ጥያቄዎን በማስኬድ ትክክለኛ እና የዘመነ መረጃ ይሰጣል።",
    pharmacyLocatorDesc: "በአካባቢዎ ያሉ ፋርማሲዎችን ያግኙ።",
    ourTechnology: "የእኛ ቴክኖሎጂ",
    techDescription: "IDA ቀልጣፋ እና አስተማማኝ አገልግሎት ለመስጠት በዘመናዊ ቴክኖሎጂ የተገነባ ነው፡",
    ourTeam: "የእኛ ቡድን",
    fullStackDev: "ሙሉ እርከን ገንቢ",
    backendDev: "የኋላ-ጫፍ ገንቢ",
    frontendDev: "የፊት-ጫፍ ገንቢ",
    uiuxDesigner: "UI/UX ዲዛይነር",
    hackathonProject: "የሃካቶን ፕሮጀክት",
    hackathonDesc:
      "IDA በAI Agents ሃካቶን ውስጥ የተገነባ ነው። ቡድናችን ይህንን መተግበሪያ የAI ወኪሎች በጤና እንክብካቤ መረጃ እና አገልግሎቶች አሰጣጥ ያላቸውን አቅም ለማሳየት ፈጥሯል።",
    viewGithub: "የGitHub ፕሮፋይል ይመልከቱ",
    aiAssistantTitle: "በሰው ሰራሽ አእምሮ የተጎናጸፈ ረዳት",
    aiAssistantMessages: [
      "የግል መድሃኒት መረጃ ያግኙ",
      "ስለ መድሃኒቶች መስተጋብር ይጠይቁ",
      "ስለ ጎንዮሽ ጉዳቶች ይወቁ",
      "የመጠቀሚያ መመሪያዎችን ይረዱ",
      "አማራጭ መድሃኒቶችን ያግኙ",
    ],
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string | string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language preference
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: TranslationKey): string | string[] => {
    return translations[language][key]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

