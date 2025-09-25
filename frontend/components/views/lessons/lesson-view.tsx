'use client';

import Loader from '@/components/layout/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLessonNavigation } from '@/hooks/lessons/use-lesson-navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useCoursesStore } from '@/stores/courses-store';
import { Lesson } from '@/types/course';
import { useState } from 'react';
import LessonHeader from './lesson-header';

interface LessonViewProps {
    courseId: string;
    lessonId: string;
    useFakeData?: boolean;
}



const FAKE_LESSON: Lesson = {
    id: 'lesson-1',
    title: 'Introduction to React Components',
    content: `
        <h2>What are React Components?</h2>
        <p>React components are the building blocks of React applications. They let you split the UI into independent, reusable pieces, and think about each piece in isolation.</p>
        
        <h3>Types of Components</h3>
        <ul>
            <li><strong>Functional Components:</strong> Simple JavaScript functions that return JSX</li>
            <li><strong>Class Components:</strong> ES6 classes that extend React.Component</li>
        </ul>
        
        <h3>Example: Functional Component</h3>
        <pre style="background-color: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto;"><code>
function Welcome(props) {
    return &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;;
}
        </code></pre>
        
        <p>This component accepts a single "props" (which stands for properties) object argument with data and returns a React element.</p>
        
        <h3>Key Concepts</h3>
        <ul>
            <li>Components must return a single element (or React Fragment)</li>
            <li>Props are read-only</li>
            <li>Component names should always start with a capital letter</li>
        </ul>
        
        <h3>Exercise</h3>
        <p>Try creating your own functional component that displays a greeting message with your name!</p>
    `,
    moduleId: 'module-1',
};

export function LessonView({ courseId, lessonId, useFakeData = false }: LessonViewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { currentCourse } = useCoursesStore();
    const { user } = useAuthStore();

    const isOwner = currentCourse?.instructor.id === user?.id;

    const [lesson] = useState<Lesson | null>(useFakeData ? FAKE_LESSON : null);


    // Use the lesson navigation hook
    const { navigation, goToNextLesson, goToPreviousLesson } = useLessonNavigation({
        courseId,
        currentLessonId: lessonId,
        moduleId: lesson?.moduleId || 'module-1'
    });


    if (isLoading) {
        return <Loader text="Loading lesson..." />;
    }

    if (!lesson) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Lesson Not Found</h2>
                    <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
                    <Button onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8'>

            {/* Lesson Header */}
            <LessonHeader
                courseId={courseId}
                isOwner={isOwner}
                onLessonSettings={() => setShowSettings(true)}
            />

            {/* Lesson Content */}
            <Card className="mb-8">
                <div className="p-6">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                    />
                </div>
            </Card>

            {/* Lesson Actions */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={goToPreviousLesson}
                        disabled={!navigation.hasPrevious}
                        className="flex items-center space-x-2"
                    >
                        <span>← Previous</span>
                    </Button>
                </div>

                <Button
                    onClick={goToNextLesson}
                    disabled={!navigation.hasNext}
                    className="flex items-center space-x-2"
                >
                    <span>Next →</span>
                </Button>
            </div>
        </div>
    );
}