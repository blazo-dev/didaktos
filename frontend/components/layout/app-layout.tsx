"use client"

import { useSidebar } from "@/hooks/common/use-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useEffect, type ReactNode } from "react"
import { ToastContainer } from "../ui/toast-container"
import { Header } from "./header"
import Loader from "./loader"
import { Sidebar } from "./sidebar"

interface AppLayoutProps {
  children: ReactNode
  showSidebar?: boolean
  showHeader?: boolean
  isLoading?: boolean
  isLanding?: boolean
}

export function AppLayout({ children, showSidebar = false, showHeader = true, isLoading = false, isLanding = false }: AppLayoutProps) {
  const { isOpen, isMobile, close, setIsMobile, shouldShowOverlay } = useSidebar();
  const isMobileDevice = useIsMobile();

  // Sync mobile state
  useEffect(() => {
    setIsMobile(isMobileDevice);
  }, [isMobileDevice, setIsMobile]);

  // Handle keyboard navigation (Escape key to close sidebar on mobile)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && isOpen && showSidebar) {
        close();
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, isOpen, showSidebar, close])

  // Handle overlay click to close sidebar
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the overlay itself, not the sidebar content
    if (event.target === event.currentTarget && isMobile) {
      close();
    }
  }

  return (
    <div className={cn("min-h-screen bg-background grid", showHeader ? "grid-rows-[auto_1fr]" : "")}>
      <ToastContainer />
      {isLoading && <Loader text="Loading..." />}
      {showHeader && (
        <Header showSidebar={showSidebar} isLanding={isLanding} />
      )}
      <div className="flex relative h-full">
        {(isOpen && showSidebar) && (
          <div
            className={cn(
              "absolute inset-0 z-40 lg:block lg:relative",
              shouldShowOverlay ? "bg-muted/80" : "lg:bg-transparent"
            )}
            onClick={handleOverlayClick}
          >
            <div className="relative w-64 h-full flex flex-col bg-surface border-r border-surface-border">
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 grid">{children}</main>
      </div>
    </div>
  )
}
