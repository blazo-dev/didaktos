'use client';

import { Card } from '@/components/ui/card';
import { useConfirmationDialog } from '@/hooks/common/use-confirmation-dialog';
import { useDeleteModule } from '@/hooks/modules/use-module-crud';
// Removed: import { useAppStore } from '@/stores/app-store';
import { useEntityModal } from '@/hooks/common/use-entity-modal';
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
    const { open } = useEntityModal();
    const deleteModule = useDeleteModule(courseId);
    const { confirmModuleDeletion } = useConfirmationDialog();

    const handleEditModule = () => {
        open("module", "edit", { module });
    };

    const handleDeleteModule = async () => {
        const confirmed = await confirmModuleDeletion(module.title);
        if (confirmed) {
            await deleteModule.mutateAsync(module.id);
        }
    };

    return (
        <Card className="p-0 gap-0 overflow-hidden bg-surface border-border">
            <ModuleHeader
                module={module}
                canEdit={canEdit}
                isExpanded={isExpanded}
                onToggle={onToggle}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
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