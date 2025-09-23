import { redirect } from "next/navigation";

function AuthPage() {
    redirect("/auth/signin");
}

export default AuthPage