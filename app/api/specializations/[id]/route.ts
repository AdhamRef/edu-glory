import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { specializationSchema } from "@/lib/validation"
import { getSession } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = specializationSchema.parse(body)

    const specialization = await prisma.specialization.update({
      where: { id },
      data: {
        name_en: validatedData.name_en,
        name_ar: validatedData.name_ar,
        duration: validatedData.duration,
        tuition: validatedData.tuition,
      },
    })

    return NextResponse.json(specialization)
  } catch (error) {
    console.error("Update specialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.specialization.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete specialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
