import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { specializationSchema } from "@/lib/validation"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = specializationSchema.parse(body)

    const specialization = await prisma.specialization.create({
      data: {
        universityId: id,
        name_en: validatedData.name_en,
        name_ar: validatedData.name_ar,
        duration: validatedData.duration,
        tuition: validatedData.tuition,
      },
    })

    return NextResponse.json(specialization, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error }, { status: 400 })
    }
    console.error("Create specialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
