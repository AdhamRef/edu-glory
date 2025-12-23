import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, FileText, Users } from "lucide-react"

export default async function AdminDashboard() {
  const [universitiesCount, applicationsCount, specializationsCount] = await Promise.all([
    prisma.university.count(),
    prisma.application.count(),
    prisma.specialization.count(),
  ])

  const recentApplications = await prisma.application.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      university: { select: { name_en: true } },
      specialization: { select: { name_en: true } },
    },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Universities</CardTitle>
            <GraduationCap className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{universitiesCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <FileText className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{applicationsCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Specializations</CardTitle>
            <Users className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{specializationsCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium text-primary">{app.studentName}</p>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-medium">{app.university.name_en}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.specialization?.name_en || "No specialization"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No applications yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
