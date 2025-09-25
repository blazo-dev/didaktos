import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Settings } from "lucide-react";
import Link from "next/link";

interface LessonHeaderProps {
    courseId: string;
    isOwner?: boolean;
    onLessonSettings: () => void;
}

function LessonHeader({ courseId, isOwner, onLessonSettings }: LessonHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <Button
                variant="ghost"
                asChild
            >
                <Link href={`/courses/${courseId}`}>
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Course
                </Link>
            </Button>

            <div className="flex items-center gap-2 mb-4">
                {isOwner && (
                    <Button
                        onClick={() => onLessonSettings()}
                        variant="outline"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Lesson Settings
                    </Button>
                )}
            </div>
        </div>
    );
}

export default LessonHeader