'use client';

// Removed: import { useAppStore } from '@/stores/app-store';
import { useEntityModal } from '@/hooks/common/use-entity-modal';
import { Module } from '@/types/course';
import { BookOpen, ChevronRight, File, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../ui/button';

interface LessonsSectionProps {
    module: Module;
    courseId: string;
    canEdit: boolean;
}

export function LessonsSection({ module, courseId, canEdit }: LessonsSectionProps) {
    const { open } = useEntityModal();
    const router = useRouter();

    const handleOpenLesson = (lessonId: string) => {
        router.push(`/courses/${courseId}/modules/${module.id}/lessons/${lessonId}`);
    };

    const handleCreateLesson = () => {
        open("lesson", "create", { moduleId: module.id });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Lessons ({module.lessons.length})
                </h4>
                {canEdit && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCreateLesson}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Lesson
                    </Button>
                )}
            </div>

            {module.lessons.length > 0 ? (
                <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleOpenLesson(lesson.id)}
                        >
                            <div className="flex items-center space-x-3">
                                <File className="h-4 w-4 text-primary" />
                                <p className="font-medium">{lesson.title}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-background">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 opacity-70" />
                    <p>No lessons in this module yet</p>
                </div>
            )}
        </div>
    );
}