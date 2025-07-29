"use client"

import MedicineSearchContent from "@/components/medicine-search-content"
import PharmacyAdvertisement from "@/components/pharmacy-advertisement"

export default function MedicineSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <PharmacyAdvertisement />
      </div>
      <MedicineSearchContent />
    </div>
  )
}
