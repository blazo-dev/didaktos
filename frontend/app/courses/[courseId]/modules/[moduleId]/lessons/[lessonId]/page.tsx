import { AppLayout } from "@/components/layout/app-layout";
import ProtectedPage from "@/components/layout/protected-page";
import { LessonView } from "@/components/views/lessons/lesson-view";

interface LessonPageProps {
    params: Promise<{
        courseId: string;
        lessonId: string;
    }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { courseId, lessonId } = await params;

    return (
        <ProtectedPage>
            <AppLayout showSidebar showHeader>
                <LessonView
                    courseId={courseId}
                />
            </AppLayout>
        </ProtectedPage>
    );
}