'use client';

import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronRight,
    Clock,
    Edit,
    FileText,
    Play,
    Plus,
    Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDeleteModule } from '../../../hooks/modules/use-delete-module';
import { Module } from '../../../types/course';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

interface ModuleAccordionProps {
    modules: Module[];
    courseId: string;
    canEdit: boolean;
    isEnrolled: boolean;
}

export function ModuleAccordion({ modules, courseId, canEdit, isEnrolled }: ModuleAccordionProps) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const router = useRouter();
    const deleteModule = useDeleteModule(courseId);

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const handleDeleteModule = async (moduleId: string, moduleName: string) => {
        if (confirm(`Are you sure you want to delete the module "${moduleName}"? This action cannot be undone.`)) {
            await deleteModule.mutateAsync(moduleId);
        }
    };

    return (
        <div className="space-y-4">
            {modules
                .sort((a, b) => a.order - b.order)
                .map((module) => {
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
                                                onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/edit`)}
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
                                    {module.description && (
                                        <p className="text-muted-foreground">{module.description}</p>
                                    )}

                                    {/* Lessons Section */}
                                    {module.lessons.length > 0 && (
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
                                                        onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/lessons/create`)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Lesson
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {module.lessons
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                                                            onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`)}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Play className="h-4 w-4 text-primary" />
                                                                <div>
                                                                    <p className="font-medium">{lesson.title}</p>
                                                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                        <span className="capitalize">{lesson.type}</span>
                                                                        {lesson.duration && (
                                                                            <span className="flex items-center">
                                                                                <Clock className="h-3 w-3 mr-1" />
                                                                                {lesson.duration} min
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* Assignments Section */}
                                    {module.assignments.length > 0 && (
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
                                                        onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/assignments/create`)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Assignment
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {module.assignments.map((assignment) => (
                                                    <div
                                                        key={assignment.id}
                                                        className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                                                        onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/assignments/${assignment.id}`)}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <FileText className="h-4 w-4 text-accent-secondary" />
                                                            <div>
                                                                <p className="font-medium">{assignment.title}</p>
                                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                    <span className="capitalize">{assignment.type}</span>
                                                                    <span className="flex items-center">
                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                        Due {new Date(assignment.dueDate).toLocaleDateString()}
                                                                    </span>
                                                                    <span>{assignment.maxPoints} pts</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty State */}
                                    {module.lessons.length === 0 && module.assignments.length === 0 && (
                                        <div className="text-center py-8">
                                            <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-muted-foreground">No content in this module yet</p>
                                            {canEdit && (
                                                <div className="flex justify-center space-x-2 mt-4">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/lessons/create`)}
                                                    >
                                                        Add Lesson
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.push(`/courses/${courseId}/modules/${module.id}/assignments/create`)}
                                                    >
                                                        Add Assignment
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}
        </div>
    );
}