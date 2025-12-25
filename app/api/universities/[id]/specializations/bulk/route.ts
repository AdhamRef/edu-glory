import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { specializationSchema } from "@/lib/validation"
import { getSession } from "@/lib/auth"
import { z } from "zod"

/**
 * Expect body:
 * [
 *   { name_en, name_ar, duration, tuition },
 *   ...
 * ]
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: universityId } = await params
    const body = await request.json()

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Body must be a non-empty array" },
        { status: 400 },
      )
    }

    // Validate EACH specialization using your existing schema
    const validated = body.map((item) =>
      specializationSchema.parse(item),
    )

    // Create all
    await prisma.specialization.createMany({
      data: validated.map((item) => ({
        universityId,
        name_en: item.name_en,
        name_ar: item.name_ar,
        duration: item.duration,
        tuition: item.tuition,
      })),
    })

    /**
     * Prisma createMany does NOT return rows,
     * so we fetch the last inserted records.
     */
    const created = await prisma.specialization.findMany({
      where: {
        universityId,
        OR: validated.map((v) => ({
          name_en: v.name_en,
          name_ar: v.name_ar,
          duration: v.duration,
          tuition: v.tuition,
        })),
      },
      take: validated.length,
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.flatten() },
        { status: 400 },
      )
    }

    console.error("Bulk create specialization error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
