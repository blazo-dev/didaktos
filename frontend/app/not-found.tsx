"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <AppLayout>
            <div className="grid place-content-center gap-6 text-center">
                <div className="space-y-6">
                    <h1 className="text-6xl font-bold text-secondary">404</h1>
                    <p className="text-lg text-muted-foreground">
                        Oops! The page you are looking for doesn't exist.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard">
                        <HomeIcon /> Go back home
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
}
