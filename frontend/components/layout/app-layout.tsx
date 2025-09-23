"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useEffect, useState, type ReactNode } from "react"
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(showSidebar);
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarVisible(true)
    }
  }, [isMobile])

  // Handle keyboard navigation (Escape key to close sidebar on mobile)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && isSidebarVisible && showSidebar) {
        setIsSidebarVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, isSidebarVisible, showSidebar])

  // Handle overlay click to close sidebar
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the overlay itself, not the sidebar content
    if (event.target === event.currentTarget && isMobile) {
      setIsSidebarVisible(false)
    }
  }

  return (
    <div className={cn("min-h-screen bg-background grid", showHeader ? "grid-rows-[auto_1fr]" : "")}>
      <ToastContainer />
      {isLoading && <Loader text="Loading..." />}
      {showHeader && (
        <Header toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} showSidebar={showSidebar} isLanding={isLanding} />
      )}
      <div className="flex relative">
        {(isSidebarVisible && showSidebar) && (
          <div
            className="absolute inset-0 z-40 lg:block lg:relative bg-muted/80 lg:bg-transparent"
            onClick={handleOverlayClick}
          >
            <Sidebar />
          </div>
        )}
        <main className="flex-1 grid">{children}</main>
      </div>
    </div>
  )
}
