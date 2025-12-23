import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UniversityForm } from "@/components/admin/university-form"
import { SpecializationsManager } from "@/components/admin/specializations-manager"

export default async function EditUniversityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const university = await prisma.university.findUnique({
    where: { id },
    include: { specializations: true },
  })

  if (!university) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Edit University</h1>
      <UniversityForm university={university} />

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Specializations</h2>
        <SpecializationsManager universityId={university.id} specializations={university.specializations} />
      </div>
    </div>
  )
}
