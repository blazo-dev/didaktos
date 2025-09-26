import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import { useCoursesStore } from "@/stores/courses-store"
import { Submission } from "@/types/course"
import { Award, Calendar, Edit, Eye, FileText, User } from "lucide-react"

function ViewAllSubmissions() {
    // Note: currentSubmissions will be implemented in useCoursesStore
    const { currentSubmissions, currentAssignment, currentCourse, setCurrentSubmission } = useCoursesStore() as any
    const { user } = useAuthStore()

    // Check if user is the instructor
    const isInstructor = currentCourse?.instructor.id === user?.id

    // If not instructor, show access denied
    if (!isInstructor) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                    <FileText className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                    <p className="text-red-600">
                        Only the course instructor can view all submissions.
                    </p>
                </div>
            </div>
        )
    }

    // If no assignment selected
    if (!currentAssignment) {
        return (
            <div className="p-8 text-center">
                <div className="bg-muted rounded-lg p-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Assignment Selected</h3>
                    <p className="text-muted-foreground">
                        Please select an assignment to view its submissions.
                    </p>
                </div>
            </div>
        )
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not submitted"
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

    const getSubmissionStatus = (submittedAt?: string) => {
        if (!submittedAt) return { text: "Not Submitted", color: "text-red-500 bg-red-50" }

        const dueDate = new Date(currentAssignment.dueDate)
        const submitDate = new Date(submittedAt)

        if (submitDate <= dueDate) {
            return { text: "On Time", color: "text-green-600 bg-green-50" }
        } else {
            return { text: "Late", color: "text-orange-600 bg-orange-50" }
        }
    }

    const handleViewSubmission = (submission: Submission) => {
        setCurrentSubmission(submission)
        // Navigation would be handled by parent component or routing
    }

    const handleGradeSubmission = (submission: Submission) => {
        setCurrentSubmission(submission)
        // Open grading modal or navigate to grading page
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="border-b border-border pb-4">
                <h1 className="text-2xl font-bold text-foreground">All Submissions</h1>
                <p className="text-muted-foreground mt-1">
                    Assignment: {currentAssignment.title}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Total Submissions: {currentSubmissions?.length || 0}</span>
                    <span>•</span>
                    <span>Due: {formatDate(currentAssignment.dueDate)}</span>
                </div>
            </div>

            {/* Assignment Overview */}
            <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Assignment Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Total Students:</span>
                        <span className="ml-2 text-muted-foreground">{currentCourse?.enrollments.length || 0}</span>
                    </div>
                    <div>
                        <span className="font-medium">Submitted:</span>
                        <span className="ml-2 text-green-600">{currentSubmissions?.length || 0}</span>
                    </div>
                    <div>
                        <span className="font-medium">Pending:</span>
                        <span className="ml-2 text-red-500">
                            {(currentCourse?.enrollments.length || 0) - (currentSubmissions?.length || 0)}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Submissions List */}
            {currentSubmissions && currentSubmissions.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Submissions</h2>
                    {currentSubmissions.map((submission: Submission) => {
                        const status = getSubmissionStatus(submission.submittedAt)
                        return (
                            <Card key={submission.id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium text-foreground">
                                                    Student ID: {submission.studentId}
                                                </span>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                {status.text}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    Submitted: {formatDate(submission.submittedAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Award className="w-4 h-4 text-muted-foreground" />
                                                <span className={`font-medium ${getGradeColor(submission.grade)}`}>
                                                    Grade: {getGradeDisplay(submission.grade)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    Content: {submission.content ? `${submission.content.slice(0, 50)}...` : 'No content'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewSubmission(submission)}
                                            className="flex items-center space-x-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View</span>
                                        </Button>
                                        <Button
                                            variant={submission.grade !== undefined ? "outline" : "default"}
                                            size="sm"
                                            onClick={() => handleGradeSubmission(submission)}
                                            className="flex items-center space-x-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>{submission.grade !== undefined ? "Regrade" : "Grade"}</span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <div className="bg-muted rounded-lg p-8">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Submissions Yet</h3>
                        <p className="text-muted-foreground">
                            No students have submitted their work for this assignment yet.
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
                <div className="space-x-2">
                    <Button variant="outline">
                        Export Grades
                    </Button>
                    <Button variant="outline">
                        Download All
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ViewAllSubmissions