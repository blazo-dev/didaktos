'use client';

import { Card } from '@/components/ui/card';
import { useConfirmationDialog } from '@/hooks/common/use-confirmation-dialog';
import { useDeleteModule } from '@/hooks/modules/use-module-crud';
import { useAppStore } from '@/stores/app-store';
import { useModalStore } from '@/stores/ui-store';
import { Module } from '@/types/course';
import { ModuleContent } from './module-content';
import { ModuleHeader } from './module-header';

interface ModuleCardProps {
    module: Module;
    courseId: string;
    canEdit: boolean;
    isExpanded: boolean;
    onToggle: () => void;
}

export function ModuleCard({ module, courseId, canEdit, isExpanded, onToggle }: ModuleCardProps) {
    const { openModal } = useModalStore();
    const { setCurrentModule } = useAppStore();
    const deleteModule = useDeleteModule(courseId);
    const { confirmModuleDeletion } = useConfirmationDialog();

    const handleEditModule = (module: Module) => {
        setCurrentModule(module);
        openModal({
            id: 'edit-module',
            title: "Edit Module",
        });
    };

    const handleDeleteModule = async (moduleId: string, moduleName: string) => {
        const confirmed = await confirmModuleDeletion(moduleName);
        if (confirmed) {
            await deleteModule.mutateAsync(moduleId);
        }
    };

    return (
        <Card className="p-0 gap-0 overflow-hidden bg-surface border-border">
            <ModuleHeader
                module={module}
                canEdit={canEdit}
                isExpanded={isExpanded}
                onToggle={onToggle}
                onEdit={() => handleEditModule(module)}
                onDelete={() => handleDeleteModule(module.id, module.title)}
            />
            {isExpanded && (
                <ModuleContent
                    module={module}
                    courseId={courseId}
                    canEdit={canEdit}
                />
            )}
        </Card>
    );
}