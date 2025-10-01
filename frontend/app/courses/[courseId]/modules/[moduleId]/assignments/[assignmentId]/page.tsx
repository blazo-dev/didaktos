import { AppLayout } from "@/components/layout/app-layout";
import ProtectedPage from "@/components/layout/protected-page";
import { AssignmentView } from "@/components/views/assignments/assignment-view";

interface AssignmentPageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
    const { courseId } = await params;

    return (
        <ProtectedPage>
            <AppLayout showSidebar showHeader>
                <AssignmentView
                    courseId={courseId}
                />
            </AppLayout>
        </ProtectedPage>
    );
}