import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import { useCoursesStore } from "@/stores/courses-store"
import { Award, FileText } from "lucide-react"

function ViewSubmission() {
    const { currentSubmission, currentAssignment, currentCourse } = useCoursesStore()
    const { user } = useAuthStore()

    if (!currentSubmission) {
        return (
            <div className="p-8 text-center">
                <div className="bg-muted rounded-lg p-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Submission Selected</h3>
                    <p className="text-muted-foreground">
                        Select a submission to view its details and content.
                    </p>
                </div>
            </div>
        )
    }

    const isInstructor = currentCourse?.instructor.id === user?.id;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not available"
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getGradeDisplay = (grade?: number) => {
        if (grade === undefined || grade === null) {
            return "Not graded"
        }
        return `${grade}/100`
    }

    const getGradeColor = (grade?: number) => {
        if (grade === undefined || grade === null) {
            return "text-muted-foreground"
        }
        if (grade >= 90) return "text-green-600"
        if (grade >= 80) return "text-blue-600"
        if (grade >= 70) return "text-yellow-600"
        return "text-red-600"
    }

    return (
        <div className="p-6 space-y-6">
            {/* Submission Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submission ID */}
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Submission ID</p>
                            <p className="text-xs text-muted-foreground truncate break-all">
                                {currentSubmission.id || "Not assigned"}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Grade */}
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Award className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Grade</p>
                            <p className={`text-xs font-semibold ${getGradeColor(currentSubmission.grade)}`}>
                                {getGradeDisplay(currentSubmission.grade)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Assignment Context */}
            {currentAssignment && (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground">Assignment Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">Assignment Title</p>
                            <p className="text-muted-foreground">{currentAssignment.title}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Due Date</p>
                            <p className="text-muted-foreground">{formatDate(currentAssignment.dueDate)}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Course Context */}
            {currentCourse && (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground">Course Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">Course Title</p>
                            <p className="text-muted-foreground">{currentCourse.title}</p>
                        </div>
                        {!isInstructor ? (<div>
                            <p className="text-sm font-medium text-foreground">Instructor</p>
                            <p className="text-muted-foreground">
                                {currentCourse.instructor.name} ({currentCourse.instructor.email})
                            </p>
                        </div>) : (
                            <div>
                                <p className="text-sm font-medium text-foreground">Student</p>
                                <p className="text-muted-foreground">
                                    {currentSubmission.name}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Submission Content */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Submission Content</h2>
                <div className="bg-muted rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {currentSubmission.content || "No content provided"}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ViewSubmission