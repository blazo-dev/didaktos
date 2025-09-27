import { useCoursesStore } from "@/stores/courses-store";
import { useModalStore } from "@/stores/ui-store";
import { Assignment, Lesson, Module, Submission } from "@/types/course";
import { useCallback } from "react";

/**
 * Specialized hook for managing course-related modals
 * Centralizes modal opening logic and state management
 */
export function useCourseModals(courseId: string) {
    const { openModal, closeModal } = useModalStore();
    const {
        setCurrentModule,
        setCurrentLesson,
        setCurrentAssignment,
        setCurrentSubmission,
        setCurrentSubmissions,
    } = useCoursesStore();

    // Module-related modals
    const openCreateModule = useCallback(() => {
        openModal({
            id: "create-module",
            title: "Create Module",
            closable: true,
            backdrop: true,
            size: "md",
        });
    }, [openModal]);

    const openEditModule = useCallback(
        (module: Module) => {
            setCurrentModule(module);
            openModal({
                id: "edit-module",
                title: "Edit Module",
                closable: true,
                backdrop: true,
                size: "md",
            });
        },
        [openModal, setCurrentModule]
    );

    // Lesson-related modals
    const openCreateLesson = useCallback(
        (moduleId?: string) => {
            openModal({
                id: "create-lesson",
                title: "Create Lesson",
                closable: true,
                backdrop: true,
                size: "md",
                data: { moduleId }, // Pass module context
            });
        },
        [openModal]
    );

    const openEditLesson = useCallback(
        (lesson: Lesson, moduleId?: string) => {
            setCurrentLesson(lesson);
            openModal({
                id: "edit-lesson",
                title: "Edit Lesson",
                closable: true,
                backdrop: true,
                size: "md",
                data: { moduleId },
            });
        },
        [openModal, setCurrentLesson]
    );

    // Assignment-related modals
    const openCreateAssignment = useCallback(
        (moduleId?: string) => {
            openModal({
                id: "create-assignment",
                title: "Create Assignment",
                closable: true,
                backdrop: true,
                size: "md",
                data: { moduleId },
            });
        },
        [openModal]
    );

    const openEditAssignment = useCallback(
        (assignment: Assignment) => {
            setCurrentAssignment(assignment);
            openModal({
                id: "edit-assignment",
                title: "Edit Assignment",
                closable: true,
                backdrop: true,
                size: "md",
            });
        },
        [openModal, setCurrentAssignment]
    );

    // Submission-related modals
    const openCreateSubmission = useCallback(
        (assignment: Assignment) => {
            setCurrentAssignment(assignment);
            openModal({
                id: "create-submission",
                title: "Submit Assignment",
                closable: true,
                backdrop: true,
                size: "xl",
            });
        },
        [openModal, setCurrentAssignment]
    );

    const openViewSubmission = useCallback(
        (
            submission: Submission,
            assignment?: Assignment,
            context: "student" | "instructor" = "student"
        ) => {
            setCurrentSubmission(submission);
            if (assignment) {
                setCurrentAssignment(assignment);
            }

            openModal({
                id:
                    context === "instructor"
                        ? "view-submission-instructor"
                        : "view-submission-student",
                title:
                    context === "instructor"
                        ? "Review Submission"
                        : "View Submission",
                closable: true,
                backdrop: true,
                size: "xl",
            });
        },
        [openModal, setCurrentSubmission, setCurrentAssignment]
    );

    const openGradeSubmission = useCallback(
        (submission: Submission, assignment?: Assignment) => {
            setCurrentSubmission(submission);
            if (assignment) {
                setCurrentAssignment(assignment);
            }

            openModal({
                id: "grade-submission",
                title: "Grade Submission",
                closable: true,
                backdrop: true,
                size: "lg",
            });
        },
        [openModal, setCurrentSubmission, setCurrentAssignment]
    );

    const openViewAllSubmissions = useCallback(
        (
            submissions: Submission[],
            assignment?: Assignment,
            title?: string
        ) => {
            setCurrentSubmissions(submissions);
            if (assignment) {
                setCurrentAssignment(assignment);
            }

            openModal({
                id: "view-all-submissions",
                title: title || "All Submissions",
                closable: true,
                backdrop: true,
                size: "xl",
            });
        },
        [openModal, setCurrentSubmissions, setCurrentAssignment]
    );

    // Generic close methods
    const closeModuleModals = useCallback(() => {
        closeModal("create-module");
        closeModal("edit-module");
    }, [closeModal]);

    const closeLessonModals = useCallback(() => {
        closeModal("create-lesson");
        closeModal("edit-lesson");
    }, [closeModal]);

    const closeAssignmentModals = useCallback(() => {
        closeModal("create-assignment");
        closeModal("edit-assignment");
    }, [closeModal]);

    const closeSubmissionModals = useCallback(() => {
        closeModal("create-submission");
        closeModal("view-submission-student");
        closeModal("view-submission-instructor");
        closeModal("grade-submission");
        closeModal("view-all-submissions");
    }, [closeModal]);

    const closeAllCourseModals = useCallback(() => {
        closeModuleModals();
        closeLessonModals();
        closeAssignmentModals();
        closeSubmissionModals();
    }, [
        closeModuleModals,
        closeLessonModals,
        closeAssignmentModals,
        closeSubmissionModals,
    ]);

    return {
        // Module modals
        openCreateModule,
        openEditModule,

        // Lesson modals
        openCreateLesson,
        openEditLesson,

        // Assignment modals
        openCreateAssignment,
        openEditAssignment,

        // Submission modals
        openCreateSubmission,
        openViewSubmission,
        openGradeSubmission,
        openViewAllSubmissions,

        // Batch close methods
        closeModuleModals,
        closeLessonModals,
        closeAssignmentModals,
        closeSubmissionModals,
        closeAllCourseModals,
    };
}
