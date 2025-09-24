import { CourseDetailView } from "@/components/views/courses/course-detail-view";

interface CoursePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { id } = await params;
    return <CourseDetailView courseId={id} />;
}