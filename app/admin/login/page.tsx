import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { GraduationCap } from "lucide-react"

export default async function AdminLoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="h-16 w-16 mx-auto text-secondary mb-4" />
          <h1 className="text-3xl font-bold text-primary-foreground">Admin Login</h1>
          <p className="text-primary-foreground/70 mt-2">Sign in to access the dashboard</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
