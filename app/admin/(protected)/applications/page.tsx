import { prisma } from "@/lib/prisma"
import { ApplicationsTable } from "@/components/admin/applications-table"

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    universityId?: string
    specializationId?: string
  }>
}) {
  const { page, universityId, specializationId } = await searchParams
  const currentPage = Number.parseInt(page || "1")
  const limit = 20

  const where: Record<string, string> = {}
  if (universityId) where.universityId = universityId
  if (specializationId) where.specializationId = specializationId

  const [applications, total, universities] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        university: { select: { id: true, name_en: true, name_ar: true } },
        specialization: { select: { id: true, name_en: true, name_ar: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
    prisma.university.findMany({
      select: { id: true, name_en: true },
      orderBy: { name_en: "asc" },
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Applications</h1>
      <ApplicationsTable
        applications={applications}
        universities={universities}
        pagination={{
          page: currentPage,
          limit,
          total,
          pages: Math.ceil(total / limit),
        }}
        currentFilters={{ universityId, specializationId }}
      />
    </div>
  )
}
