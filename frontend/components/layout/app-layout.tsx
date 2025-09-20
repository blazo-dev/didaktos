"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useEffect, useState, type ReactNode } from "react"
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

  return (
    <div className={cn("min-h-screen bg-background grid", showHeader ? "grid-rows-[auto_1fr]" : "")}>
      {isLoading && <Loader text="Loading..." />}
      {showHeader && (
        <Header toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} showSidebar={showSidebar} isLanding={isLanding} />
      )}
      <div className="flex relative">
        {(isSidebarVisible && showSidebar) && (
          <div className="absolute inset-0 z-50 lg:block lg:relative bg-muted/80 lg:bg-transparent">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 grid">{children}</main>
      </div>
    </div>
  )
}
