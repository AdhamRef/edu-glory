import { z } from "zod"

export const applicationSchema = z.object({
  universityId: z.string().min(1, "University is required"),
  specializationId: z.string().optional(),
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\d\s+()-]{8,20}$/, "Invalid phone number"),
  nationality: z.string().min(2, "Nationality is required"),
  residence: z.string().min(2, "Current residence is required"),
})

export const universitySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  type: z.enum(["university", "institute"]),
  universityType: z.enum(["private", "foreign", "government"]).optional().nullable(),
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  short_en: z.string().optional(),
  short_ar: z.string().optional(),
  content_en: z.string().optional(),
  content_ar: z.string().optional(),
  images: z.array(z.string()).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
})

export const specializationSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  duration: z.string().min(1, "Duration is required"),
  tuition: z.string().min(1, "Tuition is required"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
export type UniversityInput = z.infer<typeof universitySchema>
export type SpecializationInput = z.infer<typeof specializationSchema>
export type LoginInput = z.infer<typeof loginSchema>
