"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface AutoSuggestionProps {
  placeholder: string
  suggestions: string[]
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  icon?: React.ReactNode
  isLoading?: boolean
  buttonText?: string
  query?: string
  setQuery?: (value: string) => void
  onSelect?: (value: string) => void
}

export default function AutoSuggestion({
  placeholder,
  suggestions,
  value,
  onChange,
  onSubmit,
  icon = <Search className="h-4 w-4 mr-2" />,
  isLoading = false,
  buttonText,
  query,
  setQuery,
  onSelect,
}: AutoSuggestionProps) {
  const { t } = useLanguage()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    if (setQuery && query !== undefined) {
      setQuery(suggestion)
    }
    if (onSelect) {
      onSelect(suggestion)
    }
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {icon}
          {buttonText || t("search")}
        </Button>
      </div>
    </form>
  )
}

