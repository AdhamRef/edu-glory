"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FilePlus,
  X,
} from "lucide-react"

/* ================= TYPES ================= */

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

/* ================= HELPERS ================= */

function normalizeDigits(text: string) {
  return text.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
}

/* ================= PARSERS ================= */

function parseDuration(input: string) {
  if (!input) return ""
  let text = normalizeDigits(input).replace(/,/g, ".").trim()
  let years: number | null = null
  const hasHalf = /نصف|half/i.test(text)

  if (/^(سنة|عام)$/i.test(text)) years = 1
  else if (/^(سنتين|سنتان|عامين)$/i.test(text)) years = 2
  else {
    const num = text.match(/(\d+(\.\d+)?)/)
    if (num) years = parseFloat(num[1])
  }

  if (hasHalf) years = (years ?? 0) + 0.5
  return years ? `${years} سنة` : text
}

function parseTuition(input: string) {
  if (!input) return ""
  const cleaned = normalizeDigits(input).match(/[\d,.]+/)
  return cleaned ? `${cleaned[0]} دولار` : input
}
function isTuition(text: string) {
  // MUST have currency
  return /(دولار|\$|usd)/i.test(text)
}

function isDuration(text: string) {
  return /(سنة|سنوات|year|years)/i.test(text)
}

function hasArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text)
}

function parseBulk(text: string) {
  return text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      // Split by tab first - your data is tab-separated
      const parts = line.split("\t").map(s => s.trim()).filter(Boolean)
      
      if (parts.length >= 3) {
        // Tab-separated format: [name] [duration] [tuition]
        return parseTabSeparated(parts[0], parts[1], parts[2])
      } else {
        // Fallback to the old logic if no tabs found
        return parseBulkOldWay(line)
      }
    })
}

// Handle tab-separated data
function parseTabSeparated(rawName: string, durationRaw: string, tuitionRaw: string) {
  let name_en = ""
  let name_ar = ""

  // Split name by slash if present
  if (rawName.includes("/")) {
    const nameParts = rawName.split("/").map(s => s.trim()).filter(Boolean)
    
    if (nameParts.length >= 2) {
      const firstHasArabic = hasArabic(nameParts[0])
      const secondHasArabic = hasArabic(nameParts[1])
      
      if (firstHasArabic && !secondHasArabic) {
        name_ar = nameParts[0]
        name_en = nameParts[1]
      } else if (!firstHasArabic && secondHasArabic) {
        name_en = nameParts[0]
        name_ar = nameParts[1]
      } else if (firstHasArabic && secondHasArabic) {
        name_ar = nameParts[0]
        name_en = nameParts[1]
      } else {
        name_en = nameParts[0]
        name_ar = nameParts[1]
      }
    } else {
      name_ar = nameParts[0] || rawName
      name_en = nameParts[0] || rawName
    }
  } else if (!hasArabic(rawName)) {
    name_en = rawName
    name_ar = rawName
  } else {
    name_ar = rawName
    name_en = rawName
  }

  return {
    name_en,
    name_ar,
    duration: parseDuration(durationRaw),
    tuition: parseTuition(tuitionRaw),
  }
}

// Fallback parser for non-tab-separated data
function parseBulkOldWay(line: string) {
  // Remove all percentages first
  line = line.replace(/\d+\.?\d*%/g, "").trim()
  
  let tuitionRaw = ""
  let durationRaw = ""
  
  // Extract tuition (more flexible pattern - can be "دولار X" or "X دولار")
  const tuitionMatch = line.match(/(\d+[,.]?\d*)\s*(دولار|\$|usd)|(دولار|\$|usd)\s*(\d+[,.]?\d*)/i)
  if (tuitionMatch) {
    tuitionRaw = tuitionMatch[0]
    line = line.replace(tuitionMatch[0], "|||").trim() // Use placeholder to avoid issues
  }
  
  // Extract duration (must extract BEFORE processing the name)
  const durationMatch = line.match(/(\d+\.?\d*)\s*(سنة|سنتين|سنتان|سنوات|أشهر|شهر|year|years?|months?)/i)
  if (durationMatch) {
    durationRaw = durationMatch[0]
    line = line.replace(durationMatch[0], "|||").trim() // Use placeholder
  } else {
    const unitMatch = line.match(/(سنتين|سنتان|سنة|سنوات|أشهر|شهر|year|years?|months?)/i)
    if (unitMatch) {
      durationRaw = unitMatch[0]
      line = line.replace(unitMatch[0], "|||").trim()
    }
  }
  
  // Remove placeholders and clean up
  line = line.replace(/\|\|\|/g, " ").replace(/\s+/g, " ").trim()
  
  const rawName = line

  let name_en = ""
  let name_ar = ""

  if (rawName.includes("/")) {
    const parts = rawName.split("/").map(s => s.trim()).filter(Boolean)
    
    if (parts.length >= 2) {
      const firstHasArabic = hasArabic(parts[0])
      const secondHasArabic = hasArabic(parts[1])
      
      if (firstHasArabic && !secondHasArabic) {
        name_ar = parts[0]
        name_en = parts[1]
      } else if (!firstHasArabic && secondHasArabic) {
        name_en = parts[0]
        name_ar = parts[1]
      } else if (firstHasArabic && secondHasArabic) {
        name_ar = parts[0]
        name_en = parts[1]
      } else {
        name_en = parts[0]
        name_ar = parts[1]
      }
    } else {
      name_ar = parts[0] || rawName
      name_en = parts[0] || rawName
    }
  } else if (!hasArabic(rawName)) {
    name_en = rawName
    name_ar = rawName
  } else {
    name_ar = rawName
    name_en = rawName
  }

  return {
    name_en,
    name_ar,
    duration: parseDuration(durationRaw),
    tuition: parseTuition(tuitionRaw),
  }
}





/* ================= COMPONENT ================= */

export function SpecializationsManager({
  universityId,
  specializations,
}: Props) {
  const router = useRouter()

  const [items, setItems] = useState(specializations)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkText, setBulkText] = useState("")
  const [editForm, setEditForm] = useState<Specialization | null>(null)
  const [loading, setLoading] = useState(false)

  function resetBulk() {
    setBulkText("")
    setBulkModalOpen(false)
  }

  /* ================= BULK ADD ================= */

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

      if (!res.ok) throw new Error("Bulk add failed")

      const added: Specialization[] = await res.json()
      setItems(prev => [...prev, ...added])
      resetBulk()
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE ================= */

  async function handleDelete(id: string) {
    if (!confirm("Delete this specialization?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/specializations/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Delete failed")

      setItems(prev => prev.filter(s => s.id !== id))
    } finally {
      setLoading(false)
    }
  }

  /* ================= EDIT ================= */

  async function handleEditSave() {
    if (!editForm) return

    setLoading(true)
    try {
      const res = await fetch(`/api/specializations/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) throw new Error("Update failed")

      const updated: Specialization = await res.json()
      setItems(prev =>
        prev.map(s => (s.id === updated.id ? updated : s))
      )
      setEditForm(null)
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-6">
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditForm(spec)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(spec.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 me-2" /> Add One
            </Button>

            <Button variant="outline" onClick={() => setBulkModalOpen(true)}>
              <FilePlus className="h-4 w-4 me-2" /> Bulk Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BULK MODAL */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bulk Add</h3>
                <Button size="icon" variant="ghost" onClick={resetBulk}>
                  <X />
                </Button>
              </div>

              <Textarea
                className="max-h-64 overflow-y-auto"
                rows={8}
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button onClick={handleBulkAdd} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add All"
                  )}
                </Button>
                <Button variant="ghost" onClick={resetBulk}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EDIT MODAL */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="space-y-3 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Edit Specialization</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditForm(null)}
                >
                  <X />
                </Button>
              </div>

              {["name_en", "name_ar", "duration", "tuition"].map(key => (
                <input
                  key={key}
                  className="w-full border rounded p-2"
                  value={(editForm as any)[key]}
                  onChange={e =>
                    setEditForm({
                      ...editForm,
                      [key]: e.target.value,
                    })
                  }
                />
              ))}

              <div className="flex justify-end gap-2">
                <Button onClick={handleEditSave} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setEditForm(null)}>
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
