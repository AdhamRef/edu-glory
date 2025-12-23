import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { applicationSchema } from "@/lib/validation"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous"
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    // Verify university exists
    const university = await prisma.university.findUnique({
      where: { id: validatedData.universityId },
    })

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    // Verify specialization if provided
    if (validatedData.specializationId) {
      const specialization = await prisma.specialization.findUnique({
        where: { id: validatedData.specializationId },
      })

      if (!specialization) {
        return NextResponse.json({ error: "Specialization not found" }, { status: 404 })
      }
    }

    const application = await prisma.application.create({
      data: {
        universityId: validatedData.universityId,
        specializationId: validatedData.specializationId || null,
        studentName: validatedData.studentName,
        email: validatedData.email,
        phone: validatedData.phone,
        nationality: validatedData.nationality,
        residence: validatedData.residence,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error }, { status: 400 })
    }
    console.error("Application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const universityId = searchParams.get("universityId")
    const specializationId = searchParams.get("specializationId")

    const where: Record<string, string> = {}
    if (universityId) where.universityId = universityId
    if (specializationId) where.specializationId = specializationId

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          university: { select: { name_en: true, name_ar: true } },
          specialization: { select: { name_en: true, name_ar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
    ])

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
