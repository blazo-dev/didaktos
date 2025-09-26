import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Edit2Icon, EyeIcon, SendIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

interface AssignmentHeaderProps {
    courseId: string;
    isOwner?: boolean;
    isAlreadySubmitted?: boolean;
    onAssignmentEdit: () => void;
    onAssignmentDelete: () => void;
    onAssignmentSubmit: () => void;
    onAssignmentViewSubmissions: () => void;
}

function AssignmentHeader({ courseId, isOwner, isAlreadySubmitted, onAssignmentEdit, onAssignmentDelete, onAssignmentSubmit, onAssignmentViewSubmissions }: AssignmentHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <Button
                variant="ghost"
                asChild
            >
                <Link href={`/courses/${courseId}`}>
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Course
                </Link>
            </Button>

            <div className="flex items-center gap-2">
                {isOwner ? (
                    <>
                        <Button
                            onClick={() => onAssignmentViewSubmissions()}
                            variant="outline"
                        >
                            <EyeIcon className="h-4 w-4" />
                            View Submissions
                        </Button>
                        <Button
                            onClick={() => onAssignmentEdit()}
                            variant="outline"
                        >
                            <Edit2Icon className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            onClick={() => onAssignmentDelete()}
                            variant="destructive"
                        >
                            <Trash2Icon className="h-4 w-4" />
                            Delete
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => onAssignmentSubmit()}
                        variant="outline"
                    >
                        {isAlreadySubmitted ? 'View Submission' : (
                            <>
                                <SendIcon className="h-4 w-4" />
                                Submit
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AssignmentHeader