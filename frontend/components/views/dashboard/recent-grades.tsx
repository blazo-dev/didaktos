"use client"

interface Grade {
    id: string
    title: string
    courseTitle: string
    grade: string // String representation of the numeric grade
}

interface RecentGradesProps {
    grades: Grade[]
}

function getGradeColor(grade: string): string {
    // Handle numeric grades (convert string back to number for comparison)
    const numericGrade = parseFloat(grade)
    if (!isNaN(numericGrade)) {
        if (numericGrade >= 90) return "text-green-600"
        if (numericGrade >= 80) return "text-blue-600"
        if (numericGrade >= 70) return "text-yellow-600"
        if (numericGrade >= 60) return "text-orange-600"
        return "text-red-600"
    }
    
    // Fallback for letter grades (in case you also have letter grades)
    const letterGrade = grade.charAt(0).toUpperCase()
    switch (letterGrade) {
        case 'A':
            return "text-green-600"
        case 'B':
            return "text-blue-600"
        case 'C':
            return "text-yellow-600"
        case 'D':
            return "text-orange-600"
        case 'F':
            return "text-red-600"
        default:
            return "text-gray-600"
    }
}

export function RecentGrades({ grades }: RecentGradesProps) {
    if (grades.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Grades</h2>
                <div className="bg-surface border border-surface-border rounded-lg p-6">
                    <p className="text-muted-foreground text-center">No recent grades available</p>
                </div>
            </section>
        )
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
                Recent Grades ({grades.length})
            </h2>
            <div className="bg-surface border border-surface-border rounded-lg transition-all">
                {grades.map((grade, index) => {
                    const isLast = index === grades.length - 1
                    const gradeColor = getGradeColor(grade.grade)

                    return (
                        <div
                            key={grade.id}
                            className={`p-4 ${!isLast ? 'border-b border-surface-border' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-primary">{grade.title}</p>
                                    <p className="text-muted-foreground text-sm">{grade.courseTitle}</p>
                                </div>
                                <span className={`text-lg font-bold ${gradeColor}`}>
                                    {grade.grade}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}