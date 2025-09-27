'use client';

import { Module } from '@/types/course';
import { LessonsSection } from './sections/lessons-section';
import { AssignmentsSection } from './sections/assignments-section';

interface ModuleContentProps {
    module: Module;
    courseId: string;
    canEdit: boolean;
}

export function ModuleContent({ module, courseId, canEdit }: ModuleContentProps) {
    return (
        <div className="border-t border-border bg-muted/30 p-4 space-y-4">
            <LessonsSection module={module} courseId={courseId} canEdit={canEdit} />
            <AssignmentsSection module={module} courseId={courseId} canEdit={canEdit} />
        </div>
    );
}