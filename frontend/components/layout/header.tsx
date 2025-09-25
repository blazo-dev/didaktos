import { Button } from "@/components/ui/button"
import { useSidebar } from "@/hooks/common/use-sidebar"
import { useAuthStore } from "@/stores/auth-store"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
  showSidebar?: boolean
  isLanding?: boolean
}

export function Header({ showSidebar = false, isLanding = false }: HeaderProps) {
  const { user } = useAuthStore();
  const { toggle, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 g-container gap-6 border-b border-border bg-surface z-50">
      <div className="w-full py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-secondary-foreground font-bold text-lg">D</span>
          </div>
          <span className="font-serif font-bold text-xl text-foreground">Didaktos</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {showSidebar && isMobile && (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggle}>
                <MenuIcon />
              </Button>
            </div>
          )}{
            isLanding && (
              <div className="flex items-center gap-4">
                <Button asChild size="sm" variant="secondary">
                  {user ? (
                    <Link href="/dashboard">Go to dashboard</Link>
                  ) : (
                    <Link href="/auth/signin">Sign In</Link>
                  )}
                </Button>
              </div>
            )}
        </div>
      </div>
    </header>
  )
}
