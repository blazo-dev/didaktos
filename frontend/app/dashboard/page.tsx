
import { AppLayout } from "@/components/layout/app-layout"
import ProtectedPage from "@/components/layout/protected-page"
import { DashboardView } from "@/components/views/dashboard/dashboard-view"

function DashboardPage() {
    return (
        <ProtectedPage>
            <AppLayout showSidebar showHeader>
                <DashboardView />
            </AppLayout>
        </ProtectedPage>
    )
}

export default DashboardPage