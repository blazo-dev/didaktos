'use client';

import { Button } from '@/components/ui/button';
import { useCourseFromUrl } from '@/hooks/common/use-url-entity';
import { useCreateEnrollment } from '@/hooks/enrollments/use-create-enroll';
// Removed: import { useAppStore } from '@/stores/app-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CourseNotFoundProps {
    type: 'not-found' | 'access-denied';
}

export function CourseNotFound({ type }: CourseNotFoundProps) {
    const router = useRouter();
    const createEnrollment = useCreateEnrollment();
    // Use URL-based entity resolution for course data
    const { course, courseId } = useCourseFromUrl();


    if (type === 'not-found') {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Course not found</h2>
                <p className="text-muted-foreground mb-4">
                    The course you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button asChild>
                    <Link href="/courses">Back to Courses</Link>
                </Button>
            </div>
        );
    }

    const handleEnroll = async () => {
        if (!course && !courseId) return;

        createEnrollment.mutate(
            { courseId: course?.id || courseId },
            {
                onSuccess: () => {
                    router.push(`/courses/${course?.id || courseId}`);
                },
            }
        );
    };


    return (
        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
                You don't have permission to view this course. You must be enrolled or be the course creator.
            </p>
            <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                    <Link href="/courses">Back to Courses</Link>
                </Button>
                <Button onClick={handleEnroll} disabled={!course && !courseId}>
                    Enroll Now
                </Button>
            </div>
        </div>
    );
}