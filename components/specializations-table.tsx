'use client'
import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

interface Specialization {
  id: string
  name_en: string
  name_ar: string
  duration: string
  tuition: string
}

interface SpecializationsTableProps {
  specializations: Specialization[]
  universitySlug: string
  lang: "en" | "ar"
  dict: Record<string, Record<string, string>>
}

export function SpecializationsTable({ specializations, universitySlug, lang, dict }: SpecializationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSpecs = specializations.filter((spec) => {
    const name = lang === "ar" ? spec.name_ar : spec.name_en
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (specializations.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{dict.university.noSpecializations}</p>
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={dict.university.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-muted border-b">
                <th className="text-center p-2 sm:p-3 font-bold text-primary text-xs sm:text-sm">
                  {dict.university.specializations}
                </th>
                <th className="text-center p-2 sm:p-3 font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
                  {dict.university.duration}
                </th>
                <th className="text-center p-2 sm:p-3 font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
                  {dict.university.tuition}
                </th>
                <th className="text-center p-2 sm:p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                    {dict.university.noResults || "No results found"}
                  </td>
                </tr>
              ) : (
                filteredSpecs.map((spec) => (
                  <tr key={spec.id} className="border-b last:border-0 bg-white hover:bg-white/60">
                    <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm leading-tight">
                      {lang === "ar" ? spec.name_ar : spec.name_en}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                      {spec.duration}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                      {spec.tuition}
                    </td>
                    <td className="p-2 sm:p-3 text-right">
                      <a
                        href={`/${lang}/universities/${universitySlug}/apply?spec=${spec.id}`}
                        className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap transition-colors"
                      >
                        {dict.university.apply}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}