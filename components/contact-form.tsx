"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle } from "lucide-react"

interface ContactFormProps {
  dict: Record<string, Record<string, string>>
}

export function ContactForm({ dict }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-lg font-semibold text-primary">
          {dict.contact.name === "Your Name" ? "Message sent successfully!" : "تم إرسال الرسالة بنجاح!"}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{dict.contact.name}</Label>
        <Input id="name" name="name" required className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dict.contact.email}</Label>
        <Input id="email" name="email" type="email" required className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{dict.contact.message}</Label>
        <Textarea id="message" name="message" required rows={5} className="bg-background resize-none" />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        {loading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
        {dict.contact.send}
      </Button>
    </form>
  )
}
