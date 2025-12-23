import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted flex">
      <AdminSidebar user={session} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
