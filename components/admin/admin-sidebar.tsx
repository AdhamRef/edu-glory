"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react"
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
  const [open, setOpen] = useState(false)

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
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden absolute top-3 left-3 z-40 flex items-center justify-between bg-primary rounded-2xl text-primary-foreground px-2 py-1">

        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-64 bg-primary text-primary-foreground p-4 flex flex-col transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:min-h-screen",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/admin" className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/XkJW0nZp/Whats-App-Image-2025-12-09-at-6-44-04-PM.png"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">Education Glory</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-primary-foreground/10",
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-foreground/20 pt-4 mt-4">
          <div className="px-3 mb-4">
            <p className="text-sm opacity-70">Logged in as</p>
            <p className="font-medium truncate">
              {user.name || user.email}
            </p>
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
    </>
  )
}
