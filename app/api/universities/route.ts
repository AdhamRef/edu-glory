import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { universitySchema } from "@/lib/validation"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      include: { specializations: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(universities)
  } catch (error) {
    console.error("Get universities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = universitySchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.university.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const university = await prisma.university.create({
      data: {
        slug: validatedData.slug,
        type: validatedData.type,
        universityType: validatedData.type === "university" ? validatedData.universityType : null,
        name_en: validatedData.name_en,
        name_ar: validatedData.name_ar,
        short_en: validatedData.short_en || null,
        short_ar: validatedData.short_ar || null,
        content_en: validatedData.content_en || null,
        content_ar: validatedData.content_ar || null,
        images: validatedData.images || [],
        videoUrl: validatedData.videoUrl || null,
        isPublished: validatedData.isPublished ?? true,
      },
    })

    return NextResponse.json(university, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error }, { status: 400 })
    }
    console.error("Create university error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
