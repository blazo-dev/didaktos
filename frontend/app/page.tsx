import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, MessageCircleIcon, ShieldCheckIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <AppLayout isLanding>
      <div className="space-y-8 py-8 g-container gap-6 place-content-center">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl text-balance leading-tight">
            Transform Learning with <span className="text-secondary">Didaktos</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            The modern learning management system that empowers educators and engages students with intuitive design and powerful features.
          </p>
        </div>

        <section id="features" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="gap-4">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold">Course Management</CardTitle>
              <p className="text-muted-foreground text-md">
                Create, organize, and deliver engaging courses with our intuitive content management system.
              </p>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <MessageCircleIcon className="w-6 h-6 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold">AI Study Assistant</CardTitle>
              <p className="text-muted-foreground text-md">
                24/7 AI-powered support to help students with questions, and study planning.
              </p>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <SmartphoneIcon className="w-6 h-6 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold">Mobile Ready</CardTitle>
              <p className="text-muted-foreground text-md">
                Access your courses anytime, anywhere with our fully responsive design.
              </p>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold">Secure & Reliable</CardTitle>
              <p className="text-muted-foreground text-md">
                Benefit from our robust security measures and reliable performance, ensuring a safe learning environment.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 py-20 bg-primary text-primary-foreground text-center rounded-lg">
          <h2 className="text-3xl lg:text-4xl font-bold">Ready to Transform Your Learning Experience?</h2>
          <p className="text-lg">
            Join educators and students who are already using Didaktos to achieve better learning outcomes.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" variant={"secondary"}>
              <Link href="/auth/signup">Start Now</Link>
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
