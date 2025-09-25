'use client';

import { LessonModal } from '@/components/modals/lesson-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDeleteLesson } from '@/hooks/lessons/use-delete-lesson';
import { useAuthStore } from '@/stores/auth-store';
import { useCoursesStore } from '@/stores/courses-store';
import { useModalStore } from '@/stores/modal-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LessonHeader from './lesson-header';

interface LessonViewProps {
    courseId: string;
}


export function LessonView({ courseId }: LessonViewProps) {
    const { currentCourse, currentLesson } = useCoursesStore();
    const deleteLesson = useDeleteLesson();
    const router = useRouter();

    const { openModal } = useModalStore();
    const { user } = useAuthStore();

    const isOwner = currentCourse?.instructor.id === user?.id;

    if (!currentLesson) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
                <p className="text-muted-foreground mb-4">
                    The lesson you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button asChild>
                    <Link href="/courses">Back to Courses</Link>
                </Button>
            </div>
        );
    }

    const handleLessonEdit = () => {
        openModal({
            id: 'edit-lesson',
            title: 'Edit Lesson',
            closable: true,
            backdrop: true,
            size: 'md',
        })

    }

    const handleLessonDelete = async () => {

        if (
            confirm(
                'Are you sure you want to delete this lesson? This action cannot be undone.',
            )
        ) {
            await deleteLesson.mutateAsync(currentLesson!.id);
            router.push(`/courses/${courseId}`);
        }

    }

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8'>

            {/* Lesson Header */}
            <LessonHeader
                courseId={courseId}
                isOwner={isOwner}
                onLessonEdit={handleLessonEdit}
                onLessonDelete={handleLessonDelete}
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
            <LessonModal
                modalId="edit-lesson"
                lesson={currentLesson!}
            />
        </div>
    );
}