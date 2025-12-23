"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Loader2, Check, X } from "lucide-react"

interface Specialization {
  id: string
  name_en: string
  name_ar: string
  duration: string
  tuition: string
}

interface SpecializationsManagerProps {
  universityId: string
  specializations: Specialization[]
}

export function SpecializationsManager({ universityId, specializations }: SpecializationsManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState(specializations)
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    duration: "",
    tuition: "",
  })

  function resetForm() {
    setFormData({ name_en: "", name_ar: "", duration: "", tuition: "" })
    setEditing(null)
    setAdding(false)
  }

  async function handleAdd() {
    setLoading(true)
    try {
      const res = await fetch(`/api/universities/${universityId}/specializations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to add")

      const newSpec = await res.json()
      setItems([...items, newSpec])
      resetForm()
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/specializations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update")

      const updated = await res.json()
      setItems(items.map((item) => (item.id === id ? updated : item)))
      resetForm()
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this specialization?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/specializations/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      setItems(items.filter((item) => item.id !== id))
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(spec: Specialization) {
    setEditing(spec.id)
    setAdding(false)
    setFormData({
      name_en: spec.name_en,
      name_ar: spec.name_ar,
      duration: spec.duration,
      tuition: spec.tuition,
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
            {items.map((spec) =>
              editing === spec.id ? (
                <TableRow key={spec.id}>
                  <TableCell>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      dir="rtl"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={formData.tuition}
                      onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleUpdate(spec.id)} disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={resetForm}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={spec.id}>
                  <TableCell>{spec.name_en}</TableCell>
                  <TableCell dir="rtl">{spec.name_ar}</TableCell>
                  <TableCell>{spec.duration}</TableCell>
                  <TableCell>{spec.tuition}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(spec)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(spec.id)} disabled={loading}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ),
            )}

            {adding && (
              <TableRow>
                <TableCell>
                  <Input
                    placeholder="Name (EN)"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Name (AR)"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    dir="rtl"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Tuition"
                    value={formData.tuition}
                    onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={handleAdd} disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={resetForm}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!adding && !editing && (
          <Button
            variant="outline"
            onClick={() => {
              setAdding(true)
              setEditing(null)
              setFormData({ name_en: "", name_ar: "", duration: "", tuition: "" })
            }}
            className="mt-4"
          >
            <Plus className="h-4 w-4 me-2" />
            Add Specialization
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
