import { AppLayout } from "@/components/layout/app-layout";
import { AuthLayout } from "@/components/views/auth/auth-layout";

function AuthPage() {
    return (
        <AppLayout>
            <AuthLayout />
        </AppLayout>
    )
}

export default AuthPage