import { AppLayout } from "@/components/layout/app-layout"
import { AuthLayout } from "@/components/views/auth/auth-layout"
import { SignInForm } from "@/components/views/auth/signin-form"

function SignInPage() {
    return (
        <AppLayout>
            <AuthLayout>
                <SignInForm />
            </AuthLayout>
        </AppLayout>
    )
}

export default SignInPage