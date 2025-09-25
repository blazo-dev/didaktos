import { Course } from "../../../types/course";

// Fake course object for testing
export const FAKE_COURSE: Course = {
    id: "course-123",
    title: "Advanced React Development",
    description:
        "Master advanced React concepts including hooks, context, performance optimization, and modern patterns. Build production-ready applications with confidence.",
    status: "active",
    instructor: {
        id: "instructor-456",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
    },
    students: [
        {
            id: "student-789",
            name: "Alex Chen",
            email: "alex.chen@example.com",
            enrolledAt: "2024-01-15T10:30:00Z",
        },
        {
            id: "student-101",
            name: "Maria Garcia",
            email: "maria.garcia@example.com",
            enrolledAt: "2024-01-20T14:15:00Z",
        },
        {
            id: "student-202",
            name: "David Kim",
            email: "david.kim@example.com",
            enrolledAt: "2024-02-01T09:45:00Z",
        },
    ],
    modules: [
        {
            id: "module-1",
            courseId: "course-123",
            title: "React Fundamentals Review",
            description:
                "Quick review of React basics before diving into advanced topics",
            order: 1,
            isPublished: true,
            lessons: [
                {
                    id: "lesson-1-1",
                    moduleId: "module-1",
                    title: "Components and JSX",
                    content: "Understanding React components and JSX syntax",
                    type: "video",
                    order: 1,
                    duration: 25,
                },
                {
                    id: "lesson-1-2",
                    moduleId: "module-1",
                    title: "Props and State",
                    content: "Managing component props and local state",
                    type: "interactive",
                    order: 2,
                    duration: 30,
                },
            ],
            assignments: [
                {
                    id: "assignment-1-1",
                    moduleId: "module-1",
                    title: "Build a Todo Component",
                    description:
                        "Create a functional todo list component using hooks",
                    dueDate: "2024-12-01T23:59:59Z",
                    maxPoints: 100,
                    type: "project",
                },
            ],
        },
        {
            id: "module-2",
            courseId: "course-123",
            title: "Advanced Hooks",
            description:
                "Deep dive into React hooks including custom hooks and advanced patterns",
            order: 2,
            isPublished: true,
            lessons: [
                {
                    id: "lesson-2-1",
                    moduleId: "module-2",
                    title: "useEffect Mastery",
                    content: "Advanced useEffect patterns and cleanup",
                    type: "video",
                    order: 1,
                    duration: 45,
                },
                {
                    id: "lesson-2-2",
                    moduleId: "module-2",
                    title: "Custom Hooks",
                    content: "Creating reusable custom hooks",
                    type: "text",
                    order: 2,
                    duration: 35,
                },
                {
                    id: "lesson-2-3",
                    moduleId: "module-2",
                    title: "useCallback and useMemo",
                    content: "Performance optimization with memoization",
                    type: "video",
                    order: 3,
                    duration: 40,
                },
            ],
            assignments: [
                {
                    id: "assignment-2-1",
                    moduleId: "module-2",
                    title: "Custom Hook Challenge",
                    description:
                        "Build a custom hook for data fetching with error handling",
                    dueDate: "2024-12-08T23:59:59Z",
                    maxPoints: 150,
                    type: "project",
                },
                {
                    id: "assignment-2-2",
                    moduleId: "module-2",
                    title: "Performance Quiz",
                    description:
                        "Test your understanding of React performance optimization",
                    dueDate: "2024-12-10T23:59:59Z",
                    maxPoints: 50,
                    type: "quiz",
                },
            ],
        },
        {
            id: "module-3",
            courseId: "course-123",
            title: "Context and State Management",
            description:
                "Managing global state with Context API and state management libraries",
            order: 3,
            isPublished: false,
            lessons: [
                {
                    id: "lesson-3-1",
                    moduleId: "module-3",
                    title: "React Context API",
                    content: "Using Context for global state management",
                    type: "video",
                    order: 1,
                    duration: 50,
                },
            ],
            assignments: [],
        },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-11-15T16:30:00Z",
};
