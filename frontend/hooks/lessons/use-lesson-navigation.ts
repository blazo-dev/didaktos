import { useEffect, useState } from "react";

export interface LessonNavigation {
    currentLessonIndex: number;
    totalLessons: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextLessonId?: string;
    previousLessonId?: string;
}

export interface UseLessonNavigationProps {
    courseId: string;
    currentLessonId: string;
    moduleId: string;
}

/**
 * Hook for handling lesson navigation within a course module
 * Provides information about lesson sequence and navigation methods
 */
export function useLessonNavigation({
    courseId,
    currentLessonId,
    moduleId,
}: UseLessonNavigationProps) {
    const [navigation, setNavigation] = useState<LessonNavigation>({
        currentLessonIndex: 0,
        totalLessons: 1,
        hasNext: false,
        hasPrevious: false,
    });

    // Mock lesson data - in a real app, this would come from your course store or API
    const MOCK_LESSONS = [
        { id: "lesson-1", title: "Introduction to React Components", order: 1 },
        { id: "lesson-2", title: "Props and State", order: 2 },
        { id: "lesson-3", title: "Event Handling", order: 3 },
        { id: "lesson-4", title: "Lifecycle Methods", order: 4 },
        { id: "lesson-5", title: "Hooks Introduction", order: 5 },
    ];

    useEffect(() => {
        // Find current lesson index
        const currentIndex = MOCK_LESSONS.findIndex(
            (lesson) => lesson.id === currentLessonId
        );

        if (currentIndex !== -1) {
            const previousLesson =
                currentIndex > 0 ? MOCK_LESSONS[currentIndex - 1] : null;
            const nextLesson =
                currentIndex < MOCK_LESSONS.length - 1
                    ? MOCK_LESSONS[currentIndex + 1]
                    : null;

            setNavigation({
                currentLessonIndex: currentIndex,
                totalLessons: MOCK_LESSONS.length,
                hasNext: !!nextLesson,
                hasPrevious: !!previousLesson,
                nextLessonId: nextLesson?.id,
                previousLessonId: previousLesson?.id,
            });
        }
    }, [currentLessonId]);

    const goToNextLesson = () => {
        if (navigation.nextLessonId) {
            // In a real app, use your router here
            window.location.href = `/courses/${courseId}/lessons/${navigation.nextLessonId}`;
        }
    };

    const goToPreviousLesson = () => {
        if (navigation.previousLessonId) {
            // In a real app, use your router here
            window.location.href = `/courses/${courseId}/lessons/${navigation.previousLessonId}`;
        }
    };

    const goToLesson = (lessonId: string) => {
        window.location.href = `/courses/${courseId}/lessons/${lessonId}`;
    };

    return {
        navigation,
        goToNextLesson,
        goToPreviousLesson,
        goToLesson,
        lessons: MOCK_LESSONS,
    };
}
