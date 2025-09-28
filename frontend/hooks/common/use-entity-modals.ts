// Removed: import { useAppStore } from "@/stores/app-store";
import { useModalStore } from "@/stores/ui-store";

type ModalSize = "md" | "xl" | "lg" | "sm" | "full";

type ModalConfig = {
    id: string;
    title: string;
    size?: ModalSize;
    closable?: boolean;
    backdrop?: boolean;
    data?: any;
};

// Config de modales (readonly gracias a `as const`)
const modalConfigs = {
    course: {
        create: { id: "create-course", title: "Create Course", size: "md" },
        edit: { id: "edit-course", title: "Edit Course", size: "md" },
    },
    module: {
        create: { id: "create-module", title: "Create Module", size: "md" },
        edit: { id: "edit-module", title: "Edit Module", size: "md" },
    },
    lesson: {
        create: { id: "create-lesson", title: "Create Lesson", size: "md" },
        edit: { id: "edit-lesson", title: "Edit Lesson", size: "md" },
    },
    assignment: {
        create: {
            id: "create-assignment",
            title: "Create Assignment",
            size: "md",
        },
        edit: { id: "edit-assignment", title: "Edit Assignment", size: "md" },
    },
    submission: {
        create: {
            id: "create-submission",
            title: "Submit Assignment",
            size: "xl",
        },
        viewStudent: {
            id: "view-submission-student",
            title: "View Submission",
            size: "xl",
        },
        viewInstructor: {
            id: "view-submission-instructor",
            title: "View Submission",
            size: "xl",
        },
        grade: {
            id: "grade-submission",
            title: "Grade Submission",
            size: "lg",
        },
        all: {
            id: "view-all-submissions",
            title: "All Submissions",
            size: "xl",
        },
    },
} as const;

type ModalConfigs = typeof modalConfigs;
type EntityType = keyof ModalConfigs;
type ActionType<E extends EntityType> = keyof ModalConfigs[E];

export function useEntityModals() {
    const { openModal, closeModal } = useModalStore();
    // Removed: Global state setters - modals now receive data as props

    function open<E extends EntityType>(
        entity: E,
        action: ActionType<E>,
        data?: any
    ) {
        const config = modalConfigs[entity][action] as ModalConfig;

        // Instead of setting global state, pass data directly to modal
        const modal: ModalConfig = {
            ...config,
            closable: true,
            backdrop: true,
            data, // Modal will receive entity data via props
        };

        openModal(modal);
    }

    function close<E extends EntityType>(entity: E, action: ActionType<E>) {
        const config = modalConfigs[entity][action] as ModalConfig;
        if (config) closeModal(config.id);
    }

    return { open, close };
}
