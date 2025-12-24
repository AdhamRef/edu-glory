"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TipTapEditor } from "@/components/admin/tiptap-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Loader2 } from "lucide-react"

interface University {
  id: string
  slug: string
  type: string
  universityType: string | null
  name_en: string
  name_ar: string
  short_en: string | null
  short_ar: string | null
  content_en: string | null
  content_ar: string | null
  images: string[]
  videoUrl: string | null
  isPublished: boolean
}

interface UniversityFormProps {
  university?: University
}

export function UniversityForm({ university }: UniversityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [contentEn, setContentEn] = useState(university?.content_en || "")
  const [contentAr, setContentAr] = useState(university?.content_ar || "")
  const [images, setImages] = useState<string[]>(university?.images || [])
  const [type, setType] = useState(university?.type || "university")
  const [universityType, setUniversityType] = useState<string | null>(
    university?.universityType || null,
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const data = {
      slug: formData.get("slug"),
      type,
      universityType: type === "university" ? universityType : null,
      name_en: formData.get("name_en"),
      name_ar: formData.get("name_ar"),
      short_en: formData.get("short_en") || "",
      short_ar: formData.get("short_ar") || "",
      content_en: contentEn,
      content_ar: contentAr,
      images,
      videoUrl: formData.get("videoUrl") || "",
      isPublished: formData.get("isPublished") === "on",
    }

    try {
      const url = university
        ? `/api/universities/${university.id}`
        : "/api/universities"
      const method = university ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save")
      }

      router.push("/admin/universities")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28 md:pb-0">
      {/* BASIC INFO */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name (English) *</Label>
              <Input
                name="name_en"
                defaultValue={university?.name_en}
                required
                onChange={(e) => {
                  if (!university) {
                    const slugInput = document.getElementById(
                      "slug",
                    ) as HTMLInputElement
                    if (slugInput) slugInput.value = generateSlug(e.target.value)
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Name (Arabic) *</Label>
              <Input
                name="name_ar"
                defaultValue={university?.name_ar}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input id="slug" name="slug" defaultValue={university?.slug} required />
            </div>

            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value)
                  if (value === "institute") setUniversityType(null)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="institute">Institute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "university" && (
            <div className="space-y-2">
              <Label>University Type *</Label>
              <Select
                value={universityType || ""}
                onValueChange={setUniversityType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select university type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="foreign">Foreign</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Short Description (English)</Label>
              <Input name="short_en" defaultValue={university?.short_en || ""} />
            </div>

            <div className="space-y-2">
              <Label>Short Description (Arabic)</Label>
              <Input
                name="short_ar"
                defaultValue={university?.short_ar || ""}
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>YouTube Video URL</Label>
            <Input
              name="videoUrl"
              type="url"
              defaultValue={university?.videoUrl || ""}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isPublished"
              name="isPublished"
              defaultChecked={university?.isPublished ?? true}
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
        </CardContent>
      </Card>

      {/* CONTENT */}
      <Card>
        <CardContent className="pt-6 space-y-4 overflow-hidden">
          <div className="space-y-2">
            <Label>Content (English)</Label>
            <TipTapEditor content={contentEn} onChange={setContentEn} />
          </div>

          <div className="space-y-2">
            <Label>Content (Arabic)</Label>
            <TipTapEditor
              content={contentAr}
              onChange={setContentAr}
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      {/* IMAGES */}
      <Card>
        <CardContent className="pt-6">
          <Label className="mb-4 block">Images</Label>
          <ImageUploader images={images} onChange={setImages} />
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          {error}
        </p>
      )}

      {/* ACTION BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-background border-t p-4 flex gap-3 md:static md:border-0 md:p-0">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-secondary hover:bg-secondary/90"
        >
          {loading && (
            <Loader2 className="h-4 w-4 me-2 animate-spin" />
          )}
          {university ? "Update University" : "Create University"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/admin/universities")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
