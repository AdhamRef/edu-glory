"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GraduationCap, LayoutDashboard, Building2, FileText, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  user: {
    id: string
    email: string
    name: string | null
  }
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/universities", label: "Universities", icon: Building2 },
    { href: "/admin/applications", label: "Applications", icon: FileText },
  ]

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen p-4 flex flex-col">
      <Link href="/admin" className="flex items-center gap-2 mb-8 px-2">
        <img src="https://i.ibb.co/XkJW0nZp/Whats-App-Image-2025-12-09-at-6-44-04-PM.png" className="h-8 w-8 text-secondary" />
        <span className="text-xl font-bold">Education Glory</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-primary-foreground/10",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-primary-foreground/20 pt-4 mt-4">
        <div className="px-3 mb-4">
          <p className="text-sm opacity-70">Logged in as</p>
          <p className="font-medium truncate">{user.name || user.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 me-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
