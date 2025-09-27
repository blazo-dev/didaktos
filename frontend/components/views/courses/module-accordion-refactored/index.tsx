'use client';

import { Assignment, Lesson, Module } from '@/types/course';
import { useState } from 'react';
import { ModuleCard } from './module-card';

interface ModuleAccordionProps {
    modules: Module[];
    courseId: string;
    canEdit: boolean;
    isEnrolled: boolean;
}

export function ModuleAccordionRefactored({ modules, courseId, canEdit }: ModuleAccordionProps) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    return (
        <div className="space-y-4">
            {modules.map((module) => (
                <ModuleCard
                    key={module.id}
                    module={module}
                    courseId={courseId}
                    canEdit={canEdit}
                    isExpanded={expandedModules.has(module.id)}
                    onToggle={() => toggleModule(module.id)}
                />
            ))}
        </div>
    );
}