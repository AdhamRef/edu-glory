"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"

interface Application {
  id: string
  studentName: string
  email: string
  phone: string
  nationality: string
  residence: string
  createdAt: Date
  university: { id: string; name_en: string; name_ar: string }
  specialization: { id: string; name_en: string; name_ar: string } | null
}

interface ApplicationsTableProps {
  applications: Application[]
  universities: { id: string; name_en: string }[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  currentFilters: {
    universityId?: string
    specializationId?: string
  }
}

export function ApplicationsTable({ applications, universities, pagination, currentFilters }: ApplicationsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to first page
    router.push(`/admin/applications?${params.toString()}`)
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/admin/applications?${params.toString()}`)
  }

  function exportCSV() {
    const params = new URLSearchParams()
    if (currentFilters.universityId) {
      params.set("universityId", currentFilters.universityId)
    }
    if (currentFilters.specializationId) {
      params.set("specializationId", currentFilters.specializationId)
    }
    window.open(`/api/applications/export?${params.toString()}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>
            {pagination.total} Application{pagination.total !== 1 ? "s" : ""}
          </CardTitle>
          <div className="flex flex-wrap gap-4">
            <Select
              value={currentFilters.universityId || "all"}
              onValueChange={(v) => updateFilters("universityId", v)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Universities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 me-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-center">Student Name</TableHead>
                    <TableHead className="font-medium text-center">Email</TableHead>
                    <TableHead className="font-medium text-center">Phone</TableHead>
                    <TableHead className="font-medium text-center">Nationality</TableHead>
                    <TableHead className="font-medium text-center">University</TableHead>
                    <TableHead className="font-medium text-center">Specialization</TableHead>
                    <TableHead className="font-medium text-center">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium text-center">{app.studentName}</TableCell>
                      <TableCell className="font-medium text-center">{app.email}</TableCell>
                      <TableCell className="font-medium text-center">{app.phone}</TableCell>
                      <TableCell className="font-medium text-center">{app.nationality}</TableCell>
                      <TableCell className="font-medium text-center">{app.university.name_en}</TableCell>
                      <TableCell className="font-medium text-center">{app.specialization?.name_en || "-"}</TableCell>
                      <TableCell className="font-medium text-center">{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">No applications found</p>
        )}
      </CardContent>
    </Card>
  )
}
