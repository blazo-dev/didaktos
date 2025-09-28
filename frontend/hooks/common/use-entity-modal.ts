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

/**
 * Configuration object for predefined entity modals
 * @description Defines modal configurations for different entity types and actions.
 * Readonly configuration ensures consistency across the application.
 */
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
        create: { id: "create-lesson", title: "Create Lesson", size: "xl" },
        edit: { id: "edit-lesson", title: "Edit Lesson", size: "xl" },
    },
    assignment: {
        create: {
            id: "create-assignment",
            title: "Create Assignment",
            size: "xl",
        },
        edit: { id: "edit-assignment", title: "Edit Assignment", size: "xl" },
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
            size: "md",
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

/**
 * Standardized entity modal management hook
 *
 * @description Provides type-safe modal management for predefined entity types and actions.
 * Supports courses, modules, lessons, assignments, and submissions with different action
 * contexts (create, edit, view, grade, etc.). Replaces global state with direct data passing
 * to modals for better performance and simpler state management.
 *
 * @returns {Object} Object containing:
 *   - open: Function to open a modal with entity type, action, and optional data
 *   - close: Function to close a specific modal by entity type and action
 *
 * @example
 * ```tsx
 * const { open, close } = useEntityModal();
 *
 * // Open course creation modal
 * const handleCreateCourse = () => {
 *   open('course', 'create');
 * };
 *
 * // Open lesson edit modal with data
 * const handleEditLesson = (lesson: Lesson) => {
 *   open('lesson', 'edit', lesson);
 * };
 *
 * // Open submission grading modal
 * const handleGradeSubmission = (submission: Submission) => {
 *   open('submission', 'grade', { submission, assignment });
 * };
 *
 * // Close modal
 * const handleClose = () => {
 *   close('course', 'create');
 * };
 * ```
 */
export function useEntityModal() {
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
