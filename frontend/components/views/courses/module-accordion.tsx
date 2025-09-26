'use client';

import { useCoursesStore } from '@/stores/courses-store';
import { useModalStore } from '@/stores/modal-store';
import { Assignment, Lesson, Module } from '@/types/course';
import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronRight,
    Edit,
    File,
    FileText,
    Plus,
    Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDeleteModule } from '../../../hooks/modules/use-delete-module';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

interface ModuleAccordionProps {
    modules: Module[];
    courseId: string;
    canEdit: boolean;
    isEnrolled: boolean;
}

export function ModuleAccordion({ modules, courseId, canEdit }: ModuleAccordionProps) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const { openModal } = useModalStore();
    const router = useRouter();
    const deleteModule = useDeleteModule(courseId);
    const { setCurrentLesson, setCurrentModule, setCurrentAssignment } = useCoursesStore();

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const handleEditModule = (module: Module) => {
        setCurrentModule(module);

        openModal({
            id: 'edit-module',
            title: "Edit Module",
        });
    };

    const handleDeleteModule = async (moduleId: string, moduleName: string) => {
        const isConfirmed = window.confirm(
            `Are you sure you want to delete "${moduleName}"?\n\n` +
            `This will permanently remove:\n` +
            `• All lessons in this module\n` +
            `• All assignments in this module\n` +
            `• All student submissions\n\n` +
            `This action cannot be undone.`
        );

        if (!isConfirmed) {
            return;
        }

        await deleteModule.mutateAsync(moduleId);
    };

    const handleOpenLesson = (module: Module, lesson: Lesson) => {
        setCurrentLesson(lesson);
        setCurrentModule(module);
        router.push(`/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`);
    };

    const handleOpenAssignment = (module: Module, assignment: Assignment) => {
        setCurrentAssignment(assignment);
        setCurrentModule(module);
        router.push(`/courses/${courseId}/modules/${module.id}/assignments/${assignment.id}`);
    };

    const handleCreateLesson = (module: Module) => {
        setCurrentModule(module);

        openModal({
            id: 'create-lesson',
            title: 'Create New Lesson',
            size: 'xl',
            closable: true,
            backdrop: true,
        });
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
        <div className="space-y-4">
            {modules.map((module) => {
                const isExpanded = expandedModules.has(module.id);

                return (
                    <Card key={module.id} className="p-0 gap-0 overflow-hidden bg-surface border-border">
                        {/* Module Header */}
                        <div
                            className="px-4 py-6 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleModule(module.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {isExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-lg">{module.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {module.lessons.length} lessons • {module.assignments.length} assignments
                                        </p>
                                    </div>
                                </div>

                                {canEdit && (
                                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditModule(module)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteModule(module.id, module.title)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Module Content */}
                        {isExpanded && (
                            <div className="border-t border-border bg-muted/30 p-4 space-y-4">

                                {/* Lessons Section */}
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
                                                onClick={() => handleCreateLesson(module)}
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
                                                    onClick={() => handleOpenLesson(module, lesson)}
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


                                {/* Assignments Section */}
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
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}