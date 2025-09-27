'use client';

import { useCoursesStore } from '@/stores/courses-store';
import { useModalStore } from '@/stores/ui-store';
import { Assignment, Module } from '@/types/course';
import { Calendar, ChevronRight, FileText, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../ui/button';

interface AssignmentsSectionProps {
    module: Module;
    courseId: string;
    canEdit: boolean;
}

export function AssignmentsSection({ module, courseId, canEdit }: AssignmentsSectionProps) {
    const { openModal } = useModalStore();
    const { setCurrentAssignment, setCurrentModule } = useCoursesStore();
    const router = useRouter();

    const handleOpenAssignment = (module: Module, assignment: Assignment) => {
        setCurrentAssignment(assignment);
        setCurrentModule(module);
        router.push(`/courses/${courseId}/modules/${module.id}/assignments/${assignment.id}`);
    };

    const handleCreateAssignment = (module: Module) => {
        setCurrentModule(module);
        openModal({
            id: 'create-assignment',
            title: 'Create New Assignment',
            size: 'xl',
            closable: true,
            backdrop: true,
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Assignments ({module.assignments.length})
                </h4>
                {canEdit && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateAssignment(module)}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Assignment
                    </Button>
                )}
            </div>

            {module.assignments.length > 0 ? (
                <div className="space-y-2">
                    {module.assignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleOpenAssignment(module, assignment)}
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-accent-secondary" />
                                <div>
                                    <p className="font-medium">{assignment.title}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            Due {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-background">
                    <FileText className="h-6 w-6 mx-auto mb-2 opacity-70" />
                    <p>No assignments in this module yet</p>
                </div>
            )}
        </div>
    );
}