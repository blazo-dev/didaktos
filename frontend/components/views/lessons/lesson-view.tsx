'use client';

import Loader from '@/components/layout/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useCoursesStore } from '@/stores/courses-store';
import { useLessonsStore } from '@/stores/lessons-store';
import Link from 'next/link';
import { useState } from 'react';
import LessonHeader from './lesson-header';

interface LessonViewProps {
    courseId: string;
    lessonId: string;
}


export function LessonView({ courseId, lessonId }: LessonViewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { currentCourse } = useCoursesStore();
    const { currentLesson } = useLessonsStore();
    const { user } = useAuthStore();

    const isOwner = currentCourse?.instructor.id === user?.id;


    if (isLoading) {
        return <Loader text="Loading lesson..." />;
    }

    if (!currentLesson) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Lesson Not Found</h2>
                    <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
                    <Button>
                        <Link href={`/courses/`}>Back to Courses</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8'>

            {/* Lesson Header */}
            <LessonHeader
                courseId={courseId}
                isOwner={isOwner}
                onLessonSettings={() => setShowSettings(true)}
            />

            {/* Lesson Content */}
            <Card className="p-0 gap-0">
                <div className="p-6 border-b border-surface-border">
                    <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
                </div>

                <div className="p-6">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                </div>
            </Card>
        </div>
    );
}