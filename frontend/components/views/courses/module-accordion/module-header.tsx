'use client';

import { Module } from '@/types/course';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../ui/button';

interface ModuleHeaderProps {
    module: Module;
    canEdit: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function ModuleHeader({
    module,
    canEdit,
    isExpanded,
    onToggle,
    onEdit,
    onDelete
}: ModuleHeaderProps) {
    return (
        <div
            className="px-4 py-6 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={onToggle}
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
                            onClick={onEdit}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}