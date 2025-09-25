import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";

interface LessonHeaderProps {
    courseId: string;
    isOwner?: boolean;
    onLessonEdit: () => void;
    onLessonDelete: () => void;
}

function LessonHeader({ courseId, isOwner, onLessonEdit, onLessonDelete }: LessonHeaderProps) {
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
                    <>
                        <Button
                            onClick={() => onLessonEdit()}
                            variant="outline"
                        >
                            <Edit2Icon className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            onClick={() => onLessonDelete()}
                            variant="destructive"
                        >
                            <Trash2Icon className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default LessonHeader