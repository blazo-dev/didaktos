import { Button } from "@/components/ui/button"
import { AlertTriangle, BookOpenIcon, HelpCircle, Home, LogOut, Shield, User, LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"

const generalLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/courses", label: "Courses", icon: BookOpenIcon },
  { href: "/auth/logout", label: "Logout", icon: LogOut },
]


export function Sidebar() {
  return (
    <aside className="sticky top-18 w-full flex flex-col">
      <div className="space-y-4 p-4">
        <h3 className="text-sm font-medium text-secondary mb-4">General</h3>

        <div className="space-y-2">
          {generalLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href={link.href} className="flex items-center gap-4">
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
