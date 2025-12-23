import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  lang: Locale
  dict: Record<string, Record<string, string>>
}

export function SpecializationsTable({ specializations, universitySlug, lang, dict }: SpecializationsTableProps) {
  if (specializations.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{dict.university.noSpecializations}</p>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="font-bold text-primary">{dict.university.specializations}</TableHead>
            <TableHead className="font-bold text-primary">{dict.university.duration}</TableHead>
            <TableHead className="font-bold text-primary">{dict.university.tuition}</TableHead>
            <TableHead className="text-end" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {specializations.map((spec) => (
            <TableRow key={spec.id}>
              <TableCell className="font-medium">{lang === "ar" ? spec.name_ar : spec.name_en}</TableCell>
              <TableCell>{spec.duration}</TableCell>
              <TableCell>{spec.tuition}</TableCell>
              <TableCell className="text-end">
                <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Link href={`/${lang}/universities/${universitySlug}/apply?spec=${spec.id}`}>
                    {dict.university.apply}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
