"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle } from "lucide-react"

interface University {
  id: string
  name_en: string
  name_ar: string
  specializations: {
    id: string
    name_en: string
    name_ar: string
  }[]
}

interface ApplyFormProps {
  university: University
  preSelectedSpec?: string
  lang: Locale
  dict: Record<string, Record<string, string>>
}

export function ApplyForm({ university, preSelectedSpec, lang, dict }: ApplyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      universityId: university.id,
      specializationId: formData.get("specialization") || undefined,
      studentName: formData.get("studentName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      nationality: formData.get("nationality"),
      residence: formData.get("residence"),
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to submit")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/${lang}/universities/${university.id}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.apply.error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-lg font-semibold text-primary">{dict.apply.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="studentName">{dict.apply.studentName}</Label>
        <Input id="studentName" name="studentName" required minLength={2} className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dict.apply.email}</Label>
        <Input id="email" name="email" type="email" required className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{dict.apply.phone}</Label>
        <Input id="phone" name="phone" type="tel" required className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">{dict.apply.nationality}</Label>
        <Input id="nationality" name="nationality" required className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="residence">{dict.apply.residence}</Label>
        <Input id="residence" name="residence" required className="bg-background" />
      </div>

      {university.specializations.length > 0 && (
        <div className="space-y-2">
          <Label>{dict.apply.specialization}</Label>
          <Select name="specialization" defaultValue={preSelectedSpec || ""}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={dict.apply.specialization} />
            </SelectTrigger>
            <SelectContent>
              {university.specializations.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>
                  {lang === "ar" ? spec.name_ar : spec.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        {loading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
        {dict.apply.submit}
      </Button>
    </form>
  )
}
