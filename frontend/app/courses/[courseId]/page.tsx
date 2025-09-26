import { AppLayout } from "@/components/layout/app-layout";
import ProtectedPage from "@/components/layout/protected-page";
import { CourseDetailView } from "@/components/views/courses/course-detail-view/course-detail-view";

interface CoursePageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { courseId } = await params;
    return (
        <ProtectedPage>
            <AppLayout showSidebar showHeader>
                <CourseDetailView courseId={courseId} useFakeData={true} />
            </AppLayout>
        </ProtectedPage>
    );
}