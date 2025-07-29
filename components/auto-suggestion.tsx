"use client"

import React, { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { medicineDatabase } from "@/lib/medicine-data"

interface AutoSuggestionProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  onSelect: (term: string) => void
  suggestions?: string[]
}

export default function AutoSuggestion({ searchTerm, setSearchTerm, onSelect, suggestions }: AutoSuggestionProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Memoize the medicine list so it doesn't recreate on every render
  const medicineList = React.useMemo(() => Object.keys(medicineDatabase || {}), [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsVisible(false)
      setFilteredSuggestions([])
      return
    }

    const filtered = medicineList
      .filter((medicine) => medicine.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5) // Limit to 5 suggestions

    setFilteredSuggestions(filtered)
    setIsVisible(filtered.length > 0)
  }, [searchTerm]) // Remove medicineList from dependencies

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setIsVisible(false)
    onSelect(suggestion)
  }

  if (!isVisible || filteredSuggestions.length === 0) {
    return null
  }

  return (
    <div ref={wrapperRef} className="w-full rounded-md border bg-background shadow-md">
      <ul className="py-2">
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={index}
            className="cursor-pointer px-4 py-2 hover:bg-muted"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}
