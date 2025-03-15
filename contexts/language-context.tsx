"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Define the translations
const translations: Record<string, Record<string, string>> = {
  en: {
    home: "Home",
    about: "About",
    medicineSearch: "Medicine Search",
    pharmacyFinder: "Pharmacy Finder",
    marketplace: "Marketplace",
    searchMedicine: "Search Medicine",
    enterMedicineName: "Enter medicine name",
    search: "Search",
    searchResults: "Search Results",
    noResults: "No results found",
    loading: "Loading...",
    findPharmacy: "Find Pharmacy",
    enterLocation: "Enter your location",
    findNearby: "Find Nearby",
    pharmacyResults: "Pharmacy Results",
    noPharmacies: "No pharmacies found",
    getStarted: "Get Started",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signInWithGoogle: "Sign in with Google",
    signInWithEmail: "Sign in with Email",
    ourMission: "Our Mission",
    missionDescription:
      "Our mission is to provide accessible, accurate information about medications and connect users with nearby pharmacies. We aim to improve healthcare accessibility and empower individuals to make informed decisions about their medications.",
    howItWorks: "How It Works",
    ourTechnology: "Our Technology",
    techDescription:
      "We leverage cutting-edge technologies to deliver a seamless experience. Our platform combines AI-powered medicine information retrieval with location-based pharmacy finding capabilities.",
    ourTeam: "Our Team",
    getDetailedInfo: "Learn more about our platform, mission, and the team behind it.",
    hackathonProject: "Hackathon Project",
    hackathonDesc:
      "This project was developed as part of a hackathon focused on AI agents. Our team created an innovative solution to address medication information accessibility challenges.",
    fullStackDev: "Full Stack Developer",
    uiUxDesigner: "UI/UX Designer",
    backendDev: "Backend Developer",
    aiEngineer: "AI Engineer",
    medicineDetails: "Medicine Details",
    uses: "Uses",
    sideEffects: "Side Effects",
    dosage: "Dosage",
    precautions: "Precautions",
    interactions: "Interactions",
    pharmacyName: "Pharmacy Name",
    address: "Address",
    phone: "Phone",
    distance: "Distance",
    hours: "Hours",
    directions: "Directions",
    buyNow: "Buy Now",
    connectWallet: "Connect Wallet",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    checkout: "Checkout",
    transactionHistory: "Transaction History",
    date: "Date",
    status: "Status",
    viewDetails: "View Details",
    searchHistory: "Search History",
    clearHistory: "Clear History",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    logout: "Logout",
    english: "English",
    amharic: "አማርኛ",
    lightMode: "Light Mode",
    darkMode: "ጨለማ ሁነታ",
    systemDefault: "የስርዓት ነባሪ",
  },
  am: {
    home: "ቤት",
    about: "ስለ",
    medicineSearch: "የመድሃኒት ፍለጋ",
    pharmacyFinder: "የፋርማሲ መረጃ",
    marketplace: "ገበያ",
    searchMedicine: "መድሃኒት ፈልግ",
    enterMedicineName: "የመድሃኒት ስም ያስገቡ",
    search: "ፈልግ",
    searchResults: "የፍለጋ ውጤት",
    noResults: "ምንም ውጤት አልተገኘም",
    loading: "በመጫን ላይ...",
    findPharmacy: "ፋርማሲ ፈልግ",
    enterLocation: "አካባቢዎን ያስገቡ",
    findNearby: "በአቅራቢያ ይፈልጉ",
    pharmacyResults: "የፋርማሲ ውጤት",
    noPharmacies: "ምንም ፋርማሲ አልተገኘም",
    getStarted: "ጀምር",
    signIn: "ግባ",
    signUp: "ተመዝገብ",
    settings: "ቅንብሮች",
    language: "ቋንቋ",
    theme: "ገጽታ",
    logout: "ውጣ",
    english: "እንግሊዝኛ",
    amharic: "አማርኛ",
    lightMode: "ፀሐያማ ሁነታ",
    darkMode: "ጨለማ ሁነታ",
    systemDefault: "የስርዓት ነባሪ",
  },
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>("en");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang: string) => {
    if (isMounted) {
      localStorage.setItem("language", lang);
      setLanguage(lang);
    }
  };

  const translate = (key: string): string => {
    return translations[language]?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

