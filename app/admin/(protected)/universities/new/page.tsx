import { UniversityForm } from "@/components/admin/university-form"

export default function NewUniversityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Add University</h1>
      <UniversityForm />
    </div>
  )
}
