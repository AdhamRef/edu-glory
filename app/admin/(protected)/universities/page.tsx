import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import { DeleteUniversityButton } from "@/components/admin/delete-university-button"

export default async function AdminUniversitiesPage() {
  const universities = await prisma.university.findMany({
    include: { specializations: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  })

  const getUniversityTypeLabel = (type: string, universityType: string | null) => {
    if (type === "institute") return "Institute"
    switch (universityType) {
      case "private":
        return "Private"
      case "foreign":
        return "Foreign"
      case "government":
        return "Government"
      default:
        return "University"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Universities
        </h1>

        <Button asChild className="bg-secondary hover:bg-secondary/90 w-full sm:w-auto">
          <Link href="/admin/universities/new" className="flex items-center justify-center">
            <Plus className="h-4 w-4 me-2" />
            Add University
          </Link>
        </Button>
      </div>

      {universities.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {universities.map((uni) => (
            <Card key={uni.id} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Titles */}
                  <div className="space-y-1">
                    <CardTitle className="text-base sm:text-lg text-primary">
                      {uni.name_en}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {uni.name_ar}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={uni.isPublished ? "default" : "secondary"}
                      className={uni.isPublished ? "bg-green-500 text-white" : "bg-gray-400 text-white"}
                    >
                      {uni.isPublished ? "Published" : "Draft"}
                    </Badge>

                    <Badge variant="outline" className="capitalize">
                      {getUniversityTypeLabel(uni.type, uni.universityType)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Stats */}
                  <div className="text-sm text-muted-foreground">
                    {uni.specializations.length} specializations •{" "}
                    {uni._count.applications} applications
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <Link
                        href={`/ar/universities/${uni.slug}`}
                        target="_blank"
                        className="flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <Link
                        href={`/admin/universities/${uni.id}`}
                        className="flex items-center justify-center"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="flex-1 sm:flex-none">
                      <DeleteUniversityButton
                        id={uni.id}
                        name={uni.name_en}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No universities yet</p>

            <Button
              asChild
              className="mt-4 bg-secondary hover:bg-secondary/90 w-full sm:w-auto"
            >
              <Link href="/admin/universities/new" className="flex items-center justify-center">
                <Plus className="h-4 w-4 me-2" />
                Add your first university
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
