'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
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
                asChild
            >

                <Link href="/courses">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Courses
                </Link>
            </Button>

            {isOwner && (
                <Button variant={"outline"} onClick={onCreateModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Module
                </Button>
            )}
        </div>
    );
}