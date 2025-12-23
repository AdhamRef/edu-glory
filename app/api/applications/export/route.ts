import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get("universityId")
    const specializationId = searchParams.get("specializationId")

    const where: Record<string, string> = {}
    if (universityId) where.universityId = universityId
    if (specializationId) where.specializationId = specializationId

    const applications = await prisma.application.findMany({
      where,
      include: {
        university: { select: { name_en: true, name_ar: true } },
        specialization: { select: { name_en: true, name_ar: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    // Generate CSV
    const headers = [
      "ID",
      "Student Name",
      "Email",
      "Phone",
      "Nationality",
      "Residence",
      "University (EN)",
      "University (AR)",
      "Specialization (EN)",
      "Specialization (AR)",
      "Created At",
    ]

    const rows = applications.map((app) => [
      app.id,
      app.studentName,
      app.email,
      app.phone,
      app.nationality,
      app.residence,
      app.university.name_en,
      app.university.name_ar,
      app.specialization?.name_en || "",
      app.specialization?.name_ar || "",
      app.createdAt.toISOString(),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="applications-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
