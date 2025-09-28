'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LessonModal } from '@/components/modals/lesson-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useConfirmationDialog } from '@/hooks/common/use-confirmation-dialog';
import { useEntityModal } from '@/hooks/common/use-entity-modal';
import { useLessonFromUrl } from '@/hooks/common/use-url-entity';
import { useDeleteLesson } from '@/hooks/lessons/use-lesson-crud';
import { useAuthStore } from '@/stores/auth-store';

import { StudyAssistant } from '../assistant/study-assistant';
import LessonHeader from './lesson-header';

interface LessonViewProps {
    courseId: string;
}

interface FallbackProps {
    title: string;
    message: string;
}

function LessonFallback({ title, message }: FallbackProps) {
    return (
        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <Button asChild>
                <Link href="/courses">Back to Courses</Link>
            </Button>
        </div>
    );
}

export function LessonView({ courseId }: LessonViewProps) {
    const { course, currentLesson } = useLessonFromUrl();
    const { user } = useAuthStore();
    const { confirmDeletion } = useConfirmationDialog();
    const { open } = useEntityModal();
    const deleteLesson = useDeleteLesson();
    const router = useRouter();

    if (!course) {
        return (
            <LessonFallback
                title="Course not found"
                message="The course you're looking for doesn't exist or you don't have access to it."
            />
        );
    }

    if (!course.instructor) {
        return (
            <LessonFallback
                title="Instructor not found"
                message="We couldn't find the instructor for this course."
            />
        );
    }

    if (!currentLesson) {
        return (
            <LessonFallback
                title="Lesson not found"
                message="The lesson you're looking for doesn't exist or you don't have access to it."
            />
        );
    }

    const isOwner = course.instructor.id === user?.id;

    const handleLessonEdit = () => {
        open('lesson', 'edit', { lesson: currentLesson });
    };

    const handleLessonDelete = async () => {
        const confirmed = await confirmDeletion(currentLesson.title, 'lesson');
        if (confirmed) {
            await deleteLesson.mutateAsync(currentLesson.id);
            router.push(`/courses/${courseId}`);
        }
    };

    return (
        <div className="w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8">
            <LessonHeader
                courseId={courseId}
                isOwner={isOwner}
                onLessonEdit={handleLessonEdit}
                onLessonDelete={handleLessonDelete}
            />

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

            <LessonModal modalId="edit-lesson" />
            <StudyAssistant />
        </div>
    );
}
