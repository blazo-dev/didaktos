import { Button } from "@/components/ui/button"
import { useConfirmationDialog } from "@/hooks/common/use-confirmation-dialog"
import { useAuthStore } from "@/stores/auth-store"
import { useToastStore } from "@/stores/ui-store"
import { useQueryClient } from "@tanstack/react-query"
import { BookOpenIcon, Home, LayoutDashboardIcon, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/courses", label: "Courses", icon: BookOpenIcon },
]


export function Sidebar() {
  const { logout, setLoggingOut } = useAuthStore();
  const { addToast } = useToastStore();
  const { confirm } = useConfirmationDialog();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out?\n\nYou'll need to sign in again to access your courses and assignments.",
      confirmText: "Sign Out",
      cancelText: "Stay Signed In",
      type: "warning"
    });

    if (confirmed) {
      // Set logging out state to prevent "You must login" toast
      setLoggingOut(true);
      
      // Clear queries and logout
      queryClient.clear();
      logout();
      
      // Show success message and redirect
      addToast({ type: "info", message: "You have been signed out successfully" });
      router.replace("/");
    }
  };

  return (
    <aside className="sticky top-18 w-full flex flex-col">
      <div className="space-y-4 p-4">
        <h3 className="text-sm font-medium text-secondary mb-4">General</h3>

        <div className="space-y-2">
          {navigationLinks.map((link) => {
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

          {/* Logout Button with Confirmation */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="ml-4">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
