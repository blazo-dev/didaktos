'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

interface CourseDetailHeaderProps {
    courseId: string;
    isOwner: boolean;
    onCreateModule: () => void;
    onViewSubmissions: () => void;
}

export function CourseDetailHeader({ courseId, isOwner, onCreateModule, onViewSubmissions }: CourseDetailHeaderProps) {

    return (
        <div className="flex items-center justify-between">
            <Button
                variant="ghost"
                asChild
            >

                <Link href="/courses">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Courses
                </Link>
            </Button>

            {isOwner && (
                <div className="flex items-center gap-2">
                    <Button variant={"outline"} onClick={onCreateModule}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Module
                    </Button>
                    <Button variant={"outline"} onClick={onViewSubmissions}>
                        View Submissions
                    </Button>
                </div>
            )}
        </div>
    );
}