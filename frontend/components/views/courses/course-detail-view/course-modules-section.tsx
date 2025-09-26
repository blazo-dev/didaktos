'use client';

import { BookOpen, Plus } from 'lucide-react';
import { Module } from '../../../../types/course';
import { Button } from '../../../ui/button';
import { Card } from '../../../ui/card';
import { ModuleAccordion } from '../module-accordion';

interface CourseModulesSectionProps {
    modules: Module[];
    courseId: string;
    isOwner: boolean;
    isEnrolled: boolean;
    onCreateModule: () => void;
}

export function CourseModulesSection({
    modules,
    courseId,
    isOwner,
    isEnrolled,
    onCreateModule
}: CourseModulesSectionProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Course Modules</h2>

            {modules.length === 0 ? (
                <Card className="p-12 items-center text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No modules yet</h3>
                    <p className="text-muted-foreground mb-6">
                        {isOwner
                            ? 'Create your first module to start building your course content.'
                            : 'This course doesn\'t have any modules yet. Check back later!'
                        }
                    </p>
                    {isOwner && (
                        <Button variant={"outline"} onClick={onCreateModule}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Module
                        </Button>
                    )}
                </Card>
            ) : (
                <ModuleAccordion
                    modules={modules}
                    courseId={courseId}
                    canEdit={isOwner}
                    isEnrolled={isEnrolled}
                />
            )}
        </div>
    );
}