import { AppLayout } from "@/components/layout/app-layout"
import { AuthLayout } from "@/components/views/auth/auth-layout"
import { SignUpForm } from "@/components/views/auth/signup-form"

function SignUpPage() {
    return (
        <AppLayout>
            <AuthLayout>
                <SignUpForm />
            </AuthLayout>
        </AppLayout>
    )
}

export default SignUpPage