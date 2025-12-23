import Link from "next/link"
import Image from "next/image"
import type { Locale } from "@/lib/i18n"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ArrowRight } from "lucide-react"

interface University {
  id: string
  slug: string
  type: string
  universityType: string | null
  name_en: string
  name_ar: string
  short_en: string | null
  short_ar: string | null
  images: string[]
  specializations: { id: string }[]
}

interface UniversityCardProps {
  university: University
  lang: Locale
  dict: Record<string, Record<string, string>>
}

export function UniversityCard({ university, lang, dict }: UniversityCardProps) {
  const name = lang === "ar" ? university.name_ar : university.name_en
  const shortDesc = lang === "ar" ? university.short_ar : university.short_en

  const getTypeLabel = () => {
    if (university.type === "institute") return lang === "ar" ? "معهد" : "Institute"
    switch (university.universityType) {
      case "private":
        return lang === "ar" ? "جامعة خاصة" : "Private"
      case "foreign":
        return lang === "ar" ? "جامعة أجنبية" : "Foreign"
      case "government":
        return lang === "ar" ? "جامعة حكومية" : "Government"
      default:
        return lang === "ar" ? "جامعة" : "University"
    }
  }

  const getTypeColor = () => {
    if (university.type === "institute") return "bg-purple-600"
    switch (university.universityType) {
      case "private":
        return "bg-blue-600"
      case "foreign":
        return "bg-emerald-600"
      case "government":
        return "bg-amber-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <Link
      href={`/${lang}/universities/${university.slug}`}
      className="group block h-full focus:outline-none"
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        {/* Image */}
        <div className="relative h-[220px] sm:h-[240px] md:h-[260px] overflow-hidden bg-gray-100">
          <Image
            src={
              university.images[0] ||
              "/placeholder.svg?height=200&width=400&query=university building"
            }
            alt={name}
            fill
            className="object-contain p-3 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

          {/* Type badge */}
          <Badge
            className={`absolute top-4 ${lang === "ar" ? "right-4" : "left-4"} ${getTypeColor()} text-white border-0 px-3 py-1.5 text-xs font-semibold shadow-lg`}
          >
            {getTypeLabel()}
          </Badge>

          {/* Programs */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              <span>
                {university.specializations.length} {lang === "ar" ? "تخصص" : "Programs"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span>{dict.university.viewDetails}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-primary">
            {name}
          </h3>

          {shortDesc && (
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
              {shortDesc}
            </p>
          )}

          {/* Hover overlay cue */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-primary/20" />
        </CardContent>
      </Card>
    </Link>
  )
}
