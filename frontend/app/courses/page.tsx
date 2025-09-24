import ProtectedPage from "@/components/layout/protected-page";
import { CoursesLayout } from "@/components/views/courses/courses-layout";

export default function CoursesPage() {

    return (
        <ProtectedPage loadingText="Loading courses...">
            <CoursesLayout />
        </ProtectedPage>
    );
}
