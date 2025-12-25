"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Loader2, FilePlus, X } from "lucide-react"

interface Specialization {
  id: string
  name_en: string
  name_ar: string
  duration: string
  tuition: string
}

interface Props {
  universityId: string
  specializations: Specialization[]
}

/* =========================
   SMART PARSERS (unchanged)
========================= */

function normalizeDigits(text: string) {
  return text.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
}

function parseDuration(input: string) {
  if (!input) return ""
  let text = normalizeDigits(input).replace(/,/g, ".").replace(/\s+/g, " ").trim()
  let years: number | null = null
  const hasHalf = /نصف|half/.test(text)
  if (/^(سنة|عام)$/.test(text)) years = 1
  else if (/^(سنتين|سنتان|عامين)$/.test(text)) years = 2
  else {
    const num = text.match(/(\d+(\.\d+)?)/)
    if (num) years = parseFloat(num[1])
  }
  if (hasHalf) {
    if (years === null) years = 0.5
    else if (!String(years).includes(".5")) years += 0.5
  }
  return years ? `${years} سنة` : text
}

function parseTuition(input: string) {
  if (!input) return ""
  const cleaned = normalizeDigits(input).match(/[\d,.]+/)
  return cleaned ? `${cleaned[0]} دولار` : input
}

function parseBulk(text: string) {
  return text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(/\t+/)
      const namePart = parts[0] || ""
      const durationRaw = parts[1] || ""
      const tuitionRaw = parts[2] || ""
      const splitIndex = namePart.indexOf("/")
      const name_ar = splitIndex === -1 ? namePart.trim() : namePart.slice(0, splitIndex).trim()
      const name_en = splitIndex === -1 ? namePart.trim() : namePart.slice(splitIndex + 1).trim()
      return {
        name_ar,
        name_en,
        duration: parseDuration(durationRaw),
        tuition: parseTuition(tuitionRaw),
      }
    })
}

/* ========================= */

export function SpecializationsManager({ universityId, specializations }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(specializations)
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkText, setBulkText] = useState("")
  const [loading, setLoading] = useState(false)

  function resetForm() {
    setEditing(null)
    setAdding(false)
    setBulkText("")
    setBulkModalOpen(false)
  }

  async function handleBulkAdd() {
    const parsed = parseBulk(bulkText).filter(
      s => s.name_ar && s.duration && s.tuition
    )
    if (!parsed.length) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/universities/${universityId}/specializations/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        }
      )
      if (!res.ok) {
        const err = await res.json()
        console.error(err)
        throw new Error("Bulk add failed")
      }
      const addedSpecs: Specialization[] = await res.json()
      setItems(prev => [...prev, ...addedSpecs])
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* TABLE */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Tuition</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(spec => (
                <TableRow key={spec.id}>
                  <TableCell>{spec.name_en}</TableCell>
                  <TableCell dir="rtl">{spec.name_ar}</TableCell>
                  <TableCell>{spec.duration}</TableCell>
                  <TableCell>{spec.tuition}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(spec.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4 me-2" /> Add One
            </Button>

            <Button variant="outline" onClick={() => setBulkModalOpen(true)}>
              <FilePlus className="h-4 w-4 me-2" /> Bulk Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BULK ADD MODAL */}
{bulkModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <Card className="w-full max-w-lg">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Bulk Add Specializations</h3>
          <Button variant="ghost" size="icon" onClick={resetForm}>
            <X />
          </Button>
        </div>

        <Textarea
          className="max-h-64 overflow-y-auto" // <-- max height and scroll
          rows={8}
          placeholder="Paste rows here..."
          value={bulkText}
          onChange={e => setBulkText(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={handleBulkAdd} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add All"}
          </Button>
          <Button variant="ghost" onClick={resetForm}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}

    </>
  )
}
