'use client';

import { ArrowLeft, Plus, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../ui/button';

interface CourseDetailHeaderProps {
    courseId: string;
    isOwner: boolean;
    onCreateModule: () => void;
}

export function CourseDetailHeader({
    courseId,
    isOwner,
    onCreateModule
}: CourseDetailHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <Button
                variant="ghost"
                onClick={() => router.push('/courses')}
                className="mb-4"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
            </Button>

            <div className="flex items-center gap-2 mb-4">
                {/* Course Management Actions - Only for owners */}
                {isOwner && (
                    <>
                        <Button
                            onClick={onCreateModule}
                            variant="default"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Module
                        </Button>
                        <Button
                            onClick={() => router.push(`/courses/${courseId}/settings`)}
                            variant="outline"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Course Settings
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}