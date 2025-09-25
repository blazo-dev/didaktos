'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseDetailHeaderProps {
    courseId: string;
    isOwner: boolean;
    onCreateModule: () => void;
}

export function CourseDetailHeader({ courseId, isOwner, onCreateModule }: CourseDetailHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
            </Button>
            
            {isOwner && (
                <Button onClick={onCreateModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Module
                </Button>
            )}
        </div>
    );
}