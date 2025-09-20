import { AuthLayout } from "@/components/auth/auth-layout"
import { AppLayout } from "@/components/layout/app-layout"

function AuthPage() {
    return (
        <AppLayout>
            <AuthLayout />
        </AppLayout>
    )
}

export default AuthPage