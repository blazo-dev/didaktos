'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../../ui/button';

interface CourseNotFoundProps {
    type: 'not-found' | 'access-denied';
}

export function CourseNotFound({ type }: CourseNotFoundProps) {
    const router = useRouter();

    if (type === 'not-found') {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Course not found</h2>
                <p className="text-muted-foreground mb-4">
                    The course you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => router.push('/courses')}>
                    Back to Courses
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
                You don't have permission to view this course. You must be enrolled or be the course creator.
            </p>
            <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push('/courses')} variant="outline">
                    Back to Courses
                </Button>
                <Button onClick={() => {/* TODO: Implement enrollment modal */ }}>
                    Request Enrollment
                </Button>
            </div>
        </div>
    );
}